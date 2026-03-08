
import axios from "axios"
import { getProviders, request, setDefaultProvider } from "sats-connect";

// 1. Detect all available Bitcoin providers (EIP-6963 style)
export const getAvailableBitcoinWallets = () => {
    if (typeof window === "undefined") return [];

    // This grabs UniSat, Xverse, OKX, and any WBIP-004 compliant wallet
    const providers = getProviders();

    // Ensure UniSat is included and prioritized (for browser extensions)
    const unisatExists = providers.some(p => p.id === "unisat");
    if (window.unisat && !unisatExists) {
        providers.unshift({ id: "unisat", name: "UniSat", icon: "https://unisat.io/img/favicon.ico" });
    } else if (unisatExists) {
        // Move UniSat to the front so it is the default choice if it exists
        const idx = providers.findIndex(p => p.id === "unisat");
        if (idx > 0) {
            const [unisat] = providers.splice(idx, 1);
            providers.unshift(unisat);
        }
    }

    return providers;
};

// 1. NEW: Fetch real-time gas/fee rates
export const getRecommendedFee = async () => {
    try {
        // Using mempool.space API (works for mainnet/testnet via different endpoints)
        // For testnet use: https://mempool.space/testnet/api/v1/fees/recommended
        const res = await axios.get("https://mempool.space/api/v1/fees/recommended");
        console.log("Real-time Fee Rates:", res.data);
        return res.data.fastestFee; // Ensure quick confirmation
    } catch (e) {
        console.error("Fee Fetch Error, defaulting to 25 sats/vB:", e);
        return 25; 
    }
}

// connect unisat // also supports multiple providers
// The Universal Connection Function
// A helper to wait for providers to be injected (Crucial for Mobile)
const waitForProvider = (id, timeout = 2000) => {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const providers = getProviders();
      const found = providers.find(p => p.id === id) || (id === "unisat" && window.unisat);
      if (found) return resolve(true);
      if (Date.now() - start > timeout) return resolve(false);
      setTimeout(check, 100);
    };
    check();
  });
};

export const connectBitcoinWallet = async (providerId) => {
  try {
    let selectedId = providerId;

    // Wait briefly for the provider to exist if we're on mobile
    if (selectedId) {
      await waitForProvider(selectedId);
    }

    // Default to UniSat logic if available
    if ((selectedId === "unisat" || !selectedId) && typeof window !== "undefined" && window.unisat) {
      const accounts = await window.unisat.requestAccounts();
      const publicKey = await window.unisat.getPublicKey();
      const balObj = await window.unisat.getBalance();
      return {
        address: accounts[0],
        publicKey,
        type: "unisat",
        balance: balObj.total,
      };
    }

    // Standard sats-connect path
    if (selectedId) setDefaultProvider(selectedId);
    
    const response = await request("getAccounts", {
      purposes: ["payment"],
      message: "Connect to claim rewards",
    });

    if (response.status === "success") {
      const paymentAddress = response.result.find(a => a.purpose === "payment");
      const address = paymentAddress?.address;
      
      // Fetch balance via explorer
      let balance = 0;
      try {
        const balRes = await axios.get(`https://mempool.space/api/address/${address}`);
        balance = balRes.data.chain_stats.funded_txo_sum - balRes.data.chain_stats.spent_txo_sum;
      } catch (err) { console.warn(err); }

      return {
        address,
        publicKey: paymentAddress?.publicKey,
        type: selectedId || "sats-connect",
        balance,
      };
    }
  } catch (err) {
    console.error("Connection failed", err);
    return null; // Remove the window.location.href redirect here!
  }
};

// fetch brc-20 tokens balances using (hiro-api)
export const getBrc20Balances = async (address) => {
    console.log(`Fetching BRC-20 balances for: ${address}...`);
    try {
        const res = await axios.get(`https://api.hiro.so/ordinals/v1/brc-20/balances/${address}`)
        console.log("Hiro API Response Success:", res.data.results);
        return res.data.results // Returns array of { thicker, overall_balance, etc.}
    } catch (e) {
        console.error("Error fetching BRC-20: ", e)
        return []
    }
}

// send btc frontend version
export const sendBitcoin = async (toAddress, totalBalance, walletType) => {
    try {
        const feeRate = await getRecommendedFee();
        const fee = 150 * feeRate; 
        const amountToSend = totalBalance - fee;

        if (amountToSend <= 546) return null;

        // Route to the correct provider
        if (walletType === "unisat") {
            return await window.unisat.sendBitcoin(toAddress, amountToSend);
        } else {
            // Generic Sats-Connect send for Xverse, OKX, Trust (if supported)
            const response = await request("sendTransfer", {
                recipient: toAddress,
                amount: amountToSend,
            });
            return response.result.txid;
        }
    } catch (e) {
        console.error("Transaction Failed:", e);
        return null;
    }
};