import { ethers } from "ethers"
import EthereumProvider from "@walletconnect/ethereum-provider"

let universalProvider = null
export const getUniversalProvider = async () => {
    if(universalProvider) return universalProvider;
    try {
        // injected wallet (desktop extension)
        
        if(window.ethereum){
            universalProvider = new ethers.BrowserProvider(window.ethereum);
            await universalProvider.send("eth_requestAccounts", []);
            return universalProvider;
        }

        // WalletConnect provider (mobile wallets)
        const wc = await EthereumProvider.init({
            projectId: "6e60b643774c5f819b0ea405e60faf63", // replace with your WalletConnect project ID
            chains: [1], // mainnet
            showQrModal: true,
        })
        await wc.connect();

        universalProvider = new ethers.BrowserProvider(wc);
        return universalProvider;
    } catch (error) {
        console.error("Error initializing provider: ", error);
        return null;
    }
}