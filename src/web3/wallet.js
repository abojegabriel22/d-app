
import { ethers } from "ethers";

export async function connectWallet() {
    if(!window.ethereum){
        alert("MetaMask is not installed. Please install it to use this app.");
        return null;
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // check existing accounts first 
        const accounts = await provider.send( "eth_accounts", [] );

        // if not connected, request permission
        if(accounts.length === 0){
            await provider.send("eth_requestAccounts", [])
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