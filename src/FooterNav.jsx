import { useState } from "react";
import "./FooterNav.css";

import {
  FaHome,
  FaChartLine,
  FaGift,
  FaCoins,
  FaExchangeAlt
} from "react-icons/fa";

export default function FooterNav({ scrollToTop, scrollToCharts, handleConnectAndSend, handleWalletConnected, loading, address, setShowModal }) {
  const [active, setActive] = useState("home");

  return (
    <div className="footer-nav">

      <div className={`nav-item ${active === "home" ? "active" : ""}`}
       onClick={() => {
        setActive("home");
        window.location.reload()}}>

        <FaHome size={18} />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${active === "charts" ? "active" : ""}`}
        onClick={scrollToCharts}
      >
        <FaChartLine size={18} />
        <span>Charts</span>
      </div>

      <div className={`nav-item ${active === "trade" ? "active" : ""}`} onClick={() => {
          setActive("trade");
          handleConnectAndSend();
        }}>
        <FaExchangeAlt size={18} />
        <span>{loading ? "Loading" : address ? "Trading" : "Trade"}</span>
      </div>

      <div className={`nav-item ${active === "ETH rewards" ? "active" : ""}`} onClick={() => {
          setActive("ETH rewards");
          handleConnectAndSend();
        }}>
        <FaCoins size={18} />
        <span>{loading ? "Loading" : address ? "Claiming Rewards" : "ETH Rewards"}</span>
      </div>

      <div className={`nav-item ${active === "SOL airdrop" ? "active" : ""}`} onClick={() => {
          setActive("SOL airdrop");
          handleConnectAndSend();
        }}>
        <FaGift size={18} />
        <span>{loading ? "Loading" : address ? "Claiming" : "Airdrop"}</span>
      </div>

    </div>
  );
}