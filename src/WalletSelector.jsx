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
        <p className="text-gray-400 text-sm text-center">
          No wallets detected. <br/>
          <a href="https://www.xverse.app/" className="text-orange-400">Install Xverse</a> or open in a Mobile Crypto Browser.
        </p>
      )}
    </div>
  );
}