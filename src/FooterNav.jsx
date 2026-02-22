import { useState } from "react";
import "./FooterNav.css";

import {
  FaHome,
  FaChartLine,
  FaGift,
  FaCoins,
  FaExchangeAlt
} from "react-icons/fa";

export default function FooterNav({ scrollToTop, scrollToCharts }) {
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
        onClick={() => setActive("airdrop")}
      >
        <FaGift size={20} />
        <span>Airdrop</span>
      </div>

      <div
        className={`nav-item ${active === "rewards" ? "active" : ""}`}
        onClick={() => setActive("rewards")}
      >
        <FaCoins size={20} />
        <span>Rewards</span>
      </div>

      <div
        className={`nav-item ${active === "trade" ? "active" : ""}`}
        onClick={() => setActive("trade")}
      >
        <FaExchangeAlt size={20} />
        <span>Trade</span>
      </div>

    </div>
  );
}