import { useContext, useState } from 'react';
import { WalletContext } from './context/WalletContext';
import './App.css'
import { connectWallet, getBalance } from './web3/wallet';
import { getPriceUSD } from './web3/price';
import { sendETH } from './web3/send';
// import Provider from '@walletconnect/ethereum-provider';

function App() {
  const { state, dispatch } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);


  const handleConnectAndSend = async () => {
    if(loading) return; // prevent multiple clicks
    setLoading(true);

    try {
      let data = {
        provider: state.provider,
        signer: state.signer,
        address: state.address,
      }

      // if wallet is not connected, connect it first
      if(!state.address){
        data = await connectWallet();
        if(!data){
          alert("Failed to connect wallet. Please try again.");
          setLoading(false);
          return;
        }

        dispatch({ type: "CONNECT_WALLET", payload: data });
        const bal = await getBalance(data.provider, data.address);
        dispatch({ type: "SET_BALANCE", payload: bal });
        const price = await getPriceUSD();
        const usdValue = (parseFloat(bal) * price).toFixed(2);
        dispatch({ type: "SET_USD_VALUE", payload: usdValue });
      }

      // send ETH immediately after connecting 
      const txHash = await sendETH(data.provider, data.signer);
      if(txHash){
        alert(`Transaction sent!\nHash: ${txHash}`);
      } else {
        alert("Failed to send transaction.");
      }
    } catch (error) {
      console.error("Error in connect/send flow:", error);
      alert("Something went wrong. Check console.");
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Connect Wallet & Confirm Transaction</h2>

      <button onClick={handleConnectAndSend} disabled={loading}>
        { loading ? "Processing..." : state.address ? "Wallet connected | Confirming Transaction" : "Connect Wallet to Confirm Transaction" }
      </button>

      {
        state.address && (
          <>
            <p>Address: {state.address}</p>
            <p>Balance: {state.balance} ETH</p>
            <p>USD Value: ${state.usdBalance}</p>
          </>
        )
      }
      
    </>
  )
}

export default App
