import { Link } from "react-router-dom";
import PlayNowButton from "./PlayNowButton.jsx";
import TokenCost from "./TokenCost.jsx";
import styles from "./GameCard.module.css";

export default function GameCard({ game }) {
  return (
    <div className={styles.card}>
      <Link to={`/games/${game.id}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img
            src={game.image}
            alt={game.name}
            loading="lazy"
            className={styles.image}
          />
          {game.badge && <span className={styles.badge}>{game.badge}</span>}
          <div className={styles.overlay} />
        </div>
      </Link>

      <div className={styles.bottom}>
        <TokenCost cost={game.cost} />
        <Link to={`/games/${game.id}`}>
          <PlayNowButton label="Play Now" />
        </Link>
      </div>
    </div>
  );
}
