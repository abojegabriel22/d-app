import React, { useState } from "react";
// import { , connectBitcoinWallet } from "";
import { getAvailableBitcoinWallets, connectBitcoinWallet } from "./web3/bitcoinWallet";

const mobileWalletLinks = [
  { name: "UniSat", deepLink: "unisat://", store: "https://unisat.io/download" },
  { name: "Trust Wallet", deepLink: "trust://", store: "https://trustwallet.com/" },
  { name: "MetaMask", deepLink: "metamask://", store: "https://metamask.io/download" },
  { name: "OKX Wallet", deepLink: "okx://", store: "https://www.okx.com/wallet" },
];

export default function WalletSelector({ onConnected }) {
  // Initialize once from the available wallets list (avoids synchronous setState in an effect)
  const [wallets, setWallets] = useState(() => getAvailableBitcoinWallets());

  const openMobileWallet = (deepLink, storeUrl) => {
    // Try to open the wallet app using its deep link.
    // If the app isn't installed, most browsers fail silently; this fallback opens the download page.
    const fallback = () => {
      if (storeUrl) {
        window.location.href = storeUrl;
      }
    };

    const timeoutId = window.setTimeout(fallback, 1200);

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(timeoutId);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.location.assign(deepLink);
  };

  const handleConnect = async (id) => {
    const data = await connectBitcoinWallet(id);
    if (data) onConnected(data);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900 rounded-xl">
      <h3 className="text-dark font-bold mb-2">Connect Bitcoin Wallet</h3>
      {wallets.length > 0 ? (
        wallets.map((w) => (
          <button 
            key={w.id} 
            onClick={() => handleConnect(w.id)}
            className="flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
          >
            <img src={w.icon} alt={w.name} className="w-6 h-6 rounded" />
            <span>{w.name}</span>
          </button>
        ))
      ) : (
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            No browser-injected wallets detected.
          </p>

          <button
            className="px-4 py-2 mb-4 w-full bg-orange-500 hover:bg-orange-400 text-dark rounded-lg"
            onClick={() => handleConnect()}
          >
            Open Wallet Selector
          </button>

          <p className="text-gray-500 text-xs mb-2">
            Or open your mobile wallet directly (works on iOS/Android).
          </p>

          <div className="grid grid-cols-2 gap-2">
            {mobileWalletLinks.map((w) => (
              <button
                key={w.name}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-dark rounded-lg text-sm"
                onClick={() => openMobileWallet(w.deepLink, w.store)}
                title={`Open ${w.name}`}
              >
                {w.name}
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-xs mt-2">
            If the app is not installed, open its download page after tapping the button.
          </p>
        </div>
      )}
    </div>
  );
}