import { ethers } from "ethers"
import EthereumProvider from "@walletconnect/ethereum-provider"

export const getUniversalProvider = async () => {
    try {
        let provider;
        if(window.ethereum){
            // injected wallet (e.g MetaMask, trust wallet, etc.)
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            return provider;
        }

        // WalletConnect provider (mobile wallets)
        const wc = await EthereumProvider.init({
            projectId: "6e60b643774c5f819b0ea405e60faf63", // replace with your WalletConnect project ID
            chains: [1], // mainnet
            showQrModal: true,
        })
        await wc.connect();

        provider = new ethers.BrowserProvider(wc);
        return provider;
    } catch (error) {
        console.error("Error initializing provider: ", error);
        return null;
    }
}