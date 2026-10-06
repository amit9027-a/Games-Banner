import { useState } from "react";
import { Link } from "react-router-dom";
import { useGameCoin } from "../context/GameCoinContext.jsx";
import styles from "./GameRedeem.module.css";
import { FiHome, FiGift } from "react-icons/fi";

const REWARDS = [
  { id: "ves", name: "VEs", cost: 100, reward: 10, unit: "VEs" },
  { id: "sves", name: "SVEs", cost: 200, reward: 10, unit: "SVEs" },
  { id: "gems", name: "Gems", cost: 150, reward: 5, unit: "Gems" },
  { id: "tkns", name: "Tokens", cost: 50, reward: 20, unit: "Tokens" },
  { id: "spns", name: "Spins", cost: 80, reward: 5, unit: "Spins" },
];

export default function GameRedeem() {
  const { coins, redeemCoins, addHistory, history } = useGameCoin();
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRedeemClick = (item) => {
    setError("");
    setSuccess("");
    if (coins < item.cost) {
      setError(`Not enough Game Coins. You have ${coins}, need ${item.cost}.`);
      return;
    }
    setSelected(item);
  };

  const confirmRedeem = () => {
    if (!selected) return;
    if (redeemCoins(selected.cost)) {
      addHistory({
        from: selected.cost,
        to: selected.reward,
        unit: selected.unit,
      });
      setSuccess(
        `Redeemed ${selected.cost} Coins → ${selected.reward} ${selected.unit}`,
      );
      setSelected(null);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Redeem Game Coins</h1>
        <div className={styles.balance}>
          <span style={{ fontSize: "20px" }}>💰</span>
          <span>{coins} Game Coins</span>
        </div>
      </header>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.grid}>
        {REWARDS.map((item) => (
          <div key={item.id} className={styles.card}>
            <h3>{item.name}</h3>
            <p className={styles.rate}>
              {item.cost} Coins → {item.reward} {item.unit}
            </p>
            <button onClick={() => handleRedeemClick(item)}>REDEEM</button>
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <div className={styles.history}>
          <h3>Recent Redemptions</h3>
          {history.slice(0, 5).map((h, i) => (
            <div key={i} className={styles.historyItem}>
              <span>
                {h.from} → {h.to} {h.unit}
              </span>
              <span className={styles.date}>{h.date}</span>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Redeem Game Coins?</h2>
            <p>You are about to convert:</p>
            <p className={styles.big}>{selected.cost} Game Coins</p>
            <p>into:</p>
            <p className={styles.big}>
              {selected.reward} {selected.unit}
            </p>
            <p>Remaining: {coins - selected.cost} Coins</p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setSelected(null)}
              >
                Cancel
              </button>
              <button className={styles.confirmBtn} onClick={confirmRedeem}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className={styles.bottomNav}>
        <Link to="/games" className={styles.navItem}>
          <FiHome /> Home
        </Link>
        <Link to="/redeem" className={styles.navItem}>
          <FiGift /> Redeem
        </Link>
      </nav>
    </div>
  );
}
