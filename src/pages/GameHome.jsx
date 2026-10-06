import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { games } from "../data/gamesData.js";
import { useGameCoin } from "../context/GameCoinContext.jsx";
import PlayNowButton from "../components/games/PlayNowButton.jsx";
import styles from "./GameHome.module.css";
import { FiArrowLeft, FiHome, FiGift } from "react-icons/fi";

export default function GameHome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = games.find((g) => g.id === Number(id));
  const { coins, tokens, spendTokens } = useGameCoin();
  const [showGuide, setShowGuide] = useState(false);
  const [error, setError] = useState("");

  if (!game) {
    return <div className={styles.page}>Game not found</div>;
  }

  const handlePlay = () => {
    if (tokens < game.cost) {
      setError(`Not enough Tokens. You need ${game.cost} Tokens.`);
      return;
    }
    setError("");
    if (!game.playable) {
      setError("This game is coming soon!");
      return;
    }
    setShowGuide(true);
  };

  const startGame = () => {
    if (!game.playable) { setShowGuide(false); setError("This game is coming soon!"); return; }
    if (spendTokens(game.cost)) {
      navigate(`/games/${game.id}/play`);
    } else {
      setError("Not enough Tokens");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/games")}>
          <FiArrowLeft /> Back
        </button>
        <div className={styles.coinBadge}>
          <span style={{ fontSize: "20px" }}>💰</span>
          <span>{coins} Game Coins</span>
        </div>
      </header>

      <div className={styles.hero}>
        <img src={game.image} alt={game.name} className={styles.heroImg} />
      </div>

      <div className={styles.info}>
        <h1 className={styles.name}>{game.name}</h1>
        <p className={styles.desc}>
          Play {game.name} and earn Game Coins. Test your skills!
        </p>

        <div className={styles.entryCost}>
          <span style={{ fontSize: "20px" }}>🪙</span>
          <span>Entry: {game.cost} Tokens</span>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.playWrap} onClick={handlePlay}>
          <PlayNowButton label="Play Now" />
        </div>

        <button className={styles.guideBtn} onClick={() => setShowGuide(true)}>
          How to Play
        </button>
      </div>

      {showGuide && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowGuide(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>How to Play</h2>
            <img src={game.image} alt={game.name} className={styles.guideImg} />
            {game.id === 1 && (
              <>
                <p>• Tap the golden circles to score points.</p>
                <p>• Each tap gives you 10 points.</p>
                <p>• You have 30 seconds.</p>
                <p>• Score 100+ to earn Game Coins!</p>
              </>
            )}
            {game.id === 2 && (
              <>
                <p>• Flip cards to find matching pairs.</p>
                <p>• Each match gives 10 points.</p>
                <p>• Complete all pairs to win!</p>
              </>
            )}
            {game.id !== 1 && game.id !== 2 && (
              <p>• This game is coming soon!</p>
            )}
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowGuide(false)}
              >
                Cancel
              </button>
              <button className={styles.gotItBtn} onClick={startGame}>
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className={styles.bottomNav}>
        <Link to={`/games/${game.id}`} className={styles.navItem}>
          <FiHome /> Home
        </Link>
        <Link to="/redeem" className={styles.navItem}>
          <FiGift /> Redeem
        </Link>
      </nav>
    </div>
  );
}
