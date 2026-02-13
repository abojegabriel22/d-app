
import { getUniversalProvider } from "./provider";

import { ethers } from "ethers";

export async function connectWallet() {

    try {
        const provider = await getUniversalProvider();
        if(!provider) return null;

        // Force switch to Ethereum Mainnet
        try {
            await provider.send("wallet_switchEthereumChain", [
                { chainId: "0x1" }  // Ethereum mainnet
            ]);
        } catch (switchError) {
            console.error("Chain switch failed:", switchError);
        }

        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        return { address, provider, signer };
    } catch (error){
        console.error("Error connecting to MetaMask:", error);
        return null;
    }
}

export async function getBalance(provider, address){
    try {
        const balanceWei = await provider.getBalance(address);
        return ethers.formatEther(balanceWei);
    } catch(error){
        console.error("Error fetching balance: ", error);
        return "null";
    }
}