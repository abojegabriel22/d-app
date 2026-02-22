import { useState, useEffect } from "react";
import "./MobileCoinCard.css";
import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function MobileCoinCard({ coin }) {
  const [page, setPage] = useState(1);

  const formatCurrency = (num) =>
    "$" + num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // Convert sparkline data
  const chartData = coin.sparkline_in_7d.price.map((price, i) => ({
    price,
    index: i
  }));

  // Auto Slide Pages
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev === 4 ? 1 : prev + 1));
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // 7 Day Trend Signal
  const firstPrice = coin.sparkline_in_7d.price[0];
  const lastPrice = coin.sparkline_in_7d.price.at(-1);
  const isUp = lastPrice > firstPrice;

  return (
    <div className="card mb-3 shadow-sm overflow-x-hidden">

      {/* PAGE 1 (Trust Wallet Style) */}
      {page === 1 && (
        <div className="card-body d-flex justify-content-between align-items-center">

          <div className="d-flex align-items-center gap-2">
            <img src={coin.image} width="35" />
            <div>
              <strong>{coin.name}</strong>
              <div className="text-muted small">
                {formatCurrency(coin.current_price)}
              </div>
            </div>
          </div>

          <div className="text-end">
            <strong>{formatCurrency(coin.current_price)}</strong>
            <div className={coin.price_change_percentage_24h > 0 ? "text-success small" : "text-danger small"}>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </div>
          </div>

        </div>
      )}

      {/* PAGE 2 - Volume */}
      {page === 2 && (
        <div className="card-body d-flex justify-content-between">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>Vol: {formatCurrency(coin.total_volume)}</span>
        </div>
      )}

      {/* PAGE 3 - Market Cap */}
      {page === 3 && (
        <div className="card-body d-flex justify-content-between">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>Cap: {formatCurrency(coin.market_cap)}</span>
        </div>
      )}

      {/* PAGE 4 - Animated Chart */}
      {page === 4 && (
        <div className="card-body">

          <div className="d-flex justify-content-between mb-2">
            <strong>{coin.symbol.toUpperCase()}</strong>

            {/* Signal Indicator */}
            <span className={isUp ? "text-success" : "text-danger"}>
              {isUp ? "▲ Bullish" : "▼ Bearish"}
            </span>
          </div>

          {/* Animated Chart */}
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isUp ? "#00ff88" : "#ff4444"}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="text-center small mt-2">
            Last 7 Days Movement
          </div>

        </div>
      )}

      {/* Pagination Dots */}
      <div className="text-center pb-2">

        {[1, 2, 3, 4].map((p) => (
          <span
            key={p}
            className={`dot ${page === p ? "active-dot" : ""}`}
            onClick={() => setPage(p)}
          />
        ))}

      </div>

    </div>
  );
}