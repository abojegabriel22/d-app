import { useState } from "react";

export default function MobileCoinCard({ coin }) {
  const [page, setPage] = useState(1);

  const formatCurrency = (num) =>
    "$" + num.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="card mb-3 shadow-sm">

      {/* PAGE 1 - Trust Wallet Style */}
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

      {/* PAGE 4 */}
      {page === 4 && (
        <div className="card-body d-flex justify-content-between">
          <strong>{coin.symbol.toUpperCase()}</strong>
          <span>7d: {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%</span>
        </div>
      )}

      {/* Pagination */}
      <div className="card-footer text-center">
        <nav>
          <ul className="pagination pagination-sm justify-content-center mb-0">

            {[1, 2, 3, 4].map((p) => (
              <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              </li>
            ))}

          </ul>
        </nav>
      </div>

    </div>
  );
}