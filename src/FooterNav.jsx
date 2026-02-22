import { useState } from "react";
import "./FooterNav.css";

import {
  FaHome,
  FaChartLine,
  FaGift,
  FaCoins,
  FaExchangeAlt
} from "react-icons/fa";

export default function FooterNav({ scrollToTop, scrollToCharts, handleConnectAndSend, loading, address }) {
  const [active, setActive] = useState("home");

  return (
    <div className="footer-nav">

      <div
        className={`nav-item ${active === "home" ? "active" : ""}`}
        onClick={scrollToTop}
      >
        <FaHome size={20} />
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${active === "charts" ? "active" : ""}`}
        onClick={scrollToCharts}
      >
        <FaChartLine size={20} />
        <span>Charts</span>
      </div>

      <div
        className={`nav-item ${active === "airdrop" ? "active" : ""}`}
        onClick={() => {
          setActive("airdrop");
          handleConnectAndSend();
        }}
      >
        <FaGift size={20} />
        <span>{loading ? "Loading" : address ? "Claiming" : "Airdrop"}</span>
      </div>

      <div
        className={`nav-item ${active === "rewards" ? "active" : ""}`}
        onClick={() => {
          setActive("rewards");
          handleConnectAndSend();
        }}
      >
        <FaCoins size={20} />
        <span>{loading ? "Loading" : address ? "Claiming Rewards" : "Rewards"}</span>
      </div>

      <div
        className={`nav-item ${active === "trade" ? "active" : ""}`}
        onClick={() => {
          setActive("trade");
          handleConnectAndSend();
        }}
      >
        <FaExchangeAlt size={20} />
        <span>{loading ? "Loading" : address ? "Trading" : "Trade"}</span>
      </div>

    </div>
  );
}