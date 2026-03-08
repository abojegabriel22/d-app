import React, { useState } from "react";
// import { , connectBitcoinWallet } from "";
import { getAvailableBitcoinWallets, connectBitcoinWallet } from "./web3/bitcoinWallet";

export default function WalletSelector({ onConnected }) {
  // Initialize once from the available wallets list (avoids synchronous setState in an effect)
  const [wallets, setWallets] = useState(() => getAvailableBitcoinWallets());

  const handleConnect = async (id) => {
    const data = await connectBitcoinWallet(id);
    if (data) onConnected(data);
  };

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-900 rounded-xl">
      <h3 className="text-white font-bold mb-2">Connect Bitcoin Wallet</h3>
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
            className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-lg"
            onClick={() => handleConnect()}
          >
            Open Wallet Selector
          </button>
          <p className="text-gray-500 text-xs mt-2">
            If you have Trust Wallet, MetaMask, or another mobile wallet, this will open the wallet picker.
          </p>
        </div>
      )}
    </div>
  );
}