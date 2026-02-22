import { useState, useEffect, useRef } from "react";
import "./MobileCoinCard.css";
import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function MobileCoinCard({ coin }) {
  const [page, setPage] = useState(1);

  // Flashing price state
  const [prevPrice, setPrevPrice] = useState(coin.current_price);
  const [flash, setFlash] = useState("");

  // Pause auto slide on hover
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const formatCurrency = (num) =>
    "$" + num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  // Convert sparkline data
  const chartData = coin.sparkline_in_7d.price.map((price, i) => ({
    price,
    index: i
  }));

  // Flash effect when price changes
  useEffect(() => {
    if (coin.current_price > prevPrice) {
      setFlash("flash-green");
    } else if (coin.current_price < prevPrice) {
      setFlash("flash-red");
    }

    const timer = setTimeout(() => setFlash(""), 800);
    setPrevPrice(coin.current_price);

    return () => clearTimeout(timer);
  }, [coin.current_price]);

  // Auto Slide Pages with hover pause
  useEffect(() => {
    if (!isHovered) {
      intervalRef.current = setInterval(() => {
        setPage((prev) => (prev === 4 ? 1 : prev + 1));
      }, 3000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHovered]);

  // 7 Day Trend Signal
  const firstPrice = coin.sparkline_in_7d.price[0];
  const lastPrice = coin.sparkline_in_7d.price.at(-1);
  const isUp = lastPrice > firstPrice;

  // Buy / Sell Signal
  const signal =
    coin.price_change_percentage_24h > 2
      ? "BUY"
      : coin.price_change_percentage_24h < -2
      ? "SELL"
      : "HOLD";

  return (
    <div
      className="card mb-3 shadow-sm overflow-x-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      {/* PAGE 1 */}
      {page === 1 && (
        <div className="card-body d-flex justify-content-between align-items-center">

          <div className="d-flex align-items-center gap-2">
            <img src={coin.image} width="35" alt={coin.name} />
            <div>
              <strong>{coin.name}</strong>
              <div className={`text-muted small ${flash}`}>
                {formatCurrency(coin.current_price)}
              </div>
            </div>
          </div>

          <div className="text-end">
            <strong className={flash}>
              {formatCurrency(coin.current_price)}
            </strong>
            <div className={
              coin.price_change_percentage_24h > 0
                ? "text-success small"
                : "text-danger small"
            }>
              {coin.price_change_percentage_24h?.toFixed(2)}%
            </div>
          </div>

        </div>
      )}

      {/* PAGE 2 */}
      {page === 2 && (
        <div className="card-body d-flex justify-content-between">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>Vol: {formatCurrency(coin.total_volume)}</span>
        </div>
      )}

      {/* PAGE 3 */}
      {page === 3 && (
        <div className="card-body d-flex justify-content-between">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>Cap: {formatCurrency(coin.market_cap)}</span>
        </div>
      )}

      {/* PAGE 4 - Chart */}
      {page === 4 && (
        <div className="card-body">

          <div className="d-flex justify-content-between mb-2">
            <strong>{coin.symbol.toUpperCase()}</strong>

            <div className="d-flex gap-2">

              {/* Bullish/Bearish */}
              <span className={isUp ? "text-success" : "text-danger"}>
                {isUp ? "▲ Bullish" : "▼ Bearish"}
              </span>

              {/* Buy Sell Signal */}
              <span className={
                signal === "BUY"
                  ? "text-success"
                  : signal === "SELL"
                  ? "text-danger"
                  : "text-warning"
              }>
                {signal}
              </span>

            </div>
          </div>

          {/* Chart */}
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