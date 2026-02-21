import { useEffect, useState } from "react";
import "./AirdropStat.css";

export default function AirdropStats() {
  const claimed = 1785600;
  const remaining = claimed * 3;
  const total = claimed + remaining;
  const percentage = ((claimed / total) * 100).toFixed(2);

  // Set countdown date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          milliseconds: Math.floor(difference % 1000),
        });
      }
    }, 10); // updates milliseconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container">
        <div className="airdrop-container overflow-x-hidden">

            {/* Countdown */}
            <div className="countdown-box">
                <h4 className="live-title">
                    <span className="live-dot"></span>
                    Airdrop is live
                </h4>
                <div className="countdown">
                    <div><span>{timeLeft.days}</span><small>Days</small></div>
                    <div><span>{timeLeft.hours}</span><small>Hrs</small></div>
                    <div><span>{timeLeft.minutes}</span><small>Min</small></div>
                    <div><span>{timeLeft.seconds}</span><small>Sec</small></div>
                    <div><span>{timeLeft.milliseconds}</span><small>Ms</small></div>
                </div>
            </div>

            {/* Progress */}
            <div className="progress-section">
                <h4>Airdrop Progress</h4>
                <div className="progress-bar-wrapper">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
                </div>
                <p>{percentage}% Claimed</p>
            </div>

            {/* Token Stats */}
            <div className="token-stats">
                <div className="stat">
                <h5>Claimed</h5>
                <p>{claimed.toLocaleString()} Tokens</p>
                </div>

                <div className="stat">
                <h5>Remaining</h5>
                <p>{remaining.toLocaleString()} Tokens</p>
                </div>

                <div className="stat">
                <h5>Total Supply</h5>
                <p>{total.toLocaleString()} Tokens</p>
                </div>
            </div>

        </div>
    </div>
  );
}