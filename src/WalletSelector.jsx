import React, { useState } from "react";
// import { , connectBitcoinWallet } from "";
import { getAvailableBitcoinWallets, connectBitcoinWallet } from "./web3/bitcoinWallet";
import { getProviders } from "sats-connect";

const mobileWalletLinks = [
  { 
    name: "UniSat", 
    deepLink: "unisat://", // UniSat mostly requires manual paste
    store: "https://unisat.io/download" 
  },
  { 
    name: "OKX Wallet", 
    // OKX supports a direct browser link: okx://wallet/dapp/details?dappUrl=...
    deepLink: (url) => `okx://wallet/dapp/details?dappUrl=${encodeURIComponent(url)}`,
    store: "https://www.okx.com/wallet" 
  },
  { 
    name: "MetaMask", 
    // MetaMask uses mmaddress:// to open browser
    deepLink: (url) => `https://metamask.app.link/dapp/${url.replace("https://", "")}`,
    store: "https://metamask.io/download" 
  },
  { 
    name: "Trust Wallet", 
    deepLink: "trust://", 
    store: "https://trustwallet.com/" 
  },
];

export default function WalletSelector({ onConnected }) {
  // Initialize once from the available wallets list (avoids synchronous setState in an effect)
  const [wallets, setWallets] = useState(() => getAvailableBitcoinWallets());
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const appUrl = typeof window !== "undefined" ? window.location.href : "";

  // Some mobile wallet browsers inject providers slightly after page load.
  // Retry once shortly after mounting to give them time to appear.
  React.useEffect(() => {
    if (wallets.length === 0) {
      const retry = window.setTimeout(() => setWallets(getAvailableBitcoinWallets()), 1200);
      return () => window.clearTimeout(retry);
    }
  }, []);

  const copyDappLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2800);
    } catch {
      // Fallback for browsers where clipboard API is not available.
      const temp = document.createElement("textarea");
      temp.value = appUrl;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2800);
    }
  };

  const openMobileWallet = (wallet, currentUrl) => {
    // If we are already in a web3 browser, just try to connect immediately
    if (window.ethereum || window.unisat || getProviders().length > 0) {
      handleConnect(wallet.id);
      return;
    }

    const link = typeof wallet.deepLink === "function" 
      ? wallet.deepLink(currentUrl) 
      : wallet.deepLink;

    // Only set the store timeout if we aren't sure we're in a wallet
    const timeoutId = window.setTimeout(() => {
      window.location.href = wallet.store;
    }, 2500);

    window.addEventListener("blur", () => window.clearTimeout(timeoutId), { once: true });
    window.location.href = link;
  };

  const handleConnect = async (id) => {
    setError("");

    const data = await connectBitcoinWallet(id);
    if (data) {
      onConnected(data);
      return;
    }

    setError(
      "Unable to connect. Make sure you're opening this dapp inside your wallet's in-app browser (MetaMask / Trust / OKX) and try again."
    );
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900 rounded-xl">
      <h3 className="text-dark font-bold mb-2">Connect Bitcoin Wallet</h3>

      {wallets.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {wallets.map((w) => (
            <button
              key={w.id}
              onClick={() => handleConnect(w.id)}
              className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
            >
              <img src={w.icon} alt={w.name} className="w-6 h-6 rounded" />
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-gray-400 text-sm mb-2">
          Open this dapp from inside your mobile wallet browser (MetaMask / Trust / OKX / etc.).
        </p>

        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg px-2 py-2 bg-gray-800 text-white text-xs"
            readOnly
            value={appUrl}
            onFocus={(e) => e.target.select()}
          />
          <button
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
            onClick={copyDappLink}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Paste the link into your wallet's in-app browser to load this dapp.
        </p>

        <div className="mt-4">
          <button
            className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-400 text-dark rounded-lg text-sm"
            onClick={() => handleConnect()}
          >
            Try connecting (wallet selector)
          </button>
          {error && (
            <p className="text-red-400 text-xs mt-2">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {mobileWalletLinks.map((w) => (
          <button
            key={w.name}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm border border-gray-600"
            onClick={() => openMobileWallet(w, appUrl)}
          >
            {w.name}
          </button>
        ))}
      </div>
    </div>
  );
}