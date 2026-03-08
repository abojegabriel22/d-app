import { useEffect, useState } from "react";
import "./AirdropStat.css";

export default function AirdropStats() {
  const TOTAL_SUPPLY = 7000000;
  const [claimed, setClaimed] = useState(1785600);
  const remaining = TOTAL_SUPPLY - claimed;
  // const total = claimed + remaining;
  const percentage = ((claimed / TOTAL_SUPPLY) * 100).toFixed(2);

  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  useEffect(() => {
    // Create fixed end timestamp ONCE inside effect
    const endTime = Date.now() + 6 * 24 * 60 * 60 * 1000;

    function calculateTime(difference) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        milliseconds: Math.floor(difference % 1000),
      };
    }

    const timer = setInterval(() => {
      const diff = endTime - Date.now();

      if (diff <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft(calculateTime(diff));
    }, 100);

    return () => clearInterval(timer);
  }, []);
  // Random claimed increase
  useEffect(() => {
    const claimInterval = setInterval(() => {
      setClaimed((prev) => {
        if (prev >= TOTAL_SUPPLY) return TOTAL_SUPPLY;

        const randomIncrease = Math.floor(Math.random() * 5000) + 1000;
        const newValue = prev + randomIncrease;

        return newValue > TOTAL_SUPPLY
          ? TOTAL_SUPPLY
          : newValue;
      });
    }, 2000); // every 2 seconds

    return () => clearInterval(claimInterval);
  }, []);

  return (
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
          <p>{TOTAL_SUPPLY.toLocaleString()} Tokens</p>
        </div>
      </div>
    </div>
  );
}