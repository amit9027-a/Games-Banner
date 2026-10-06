import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiGift, FiZap } from "react-icons/fi";
import GamesCarousel from "../components/games/GamesCarousel.jsx";
import { useGameCoin } from "../context/GameCoinContext.jsx";
import styles from "./Games.module.css";

export default function Games() {
  const { coins, tokens } = useGameCoin();
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <span className={styles.eyebrow}><FiZap /> ARCADE HUB</span>
          <h1 className={styles.title}>Play. Win. <span>Earn.</span></h1>
          <p className={styles.subtitle}>Pick a game, beat your best score and turn your wins into rewards.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.balance}><span>🪙</span><div><small>Tokens</small><strong>{tokens}</strong></div></div>
          <div className={styles.balance}><span>💰</span><div><small>Game Coins</small><strong>{coins}</strong></div></div>
          <Link to="/redeem" className={styles.redeem}><FiGift /> Redeem</Link>
        </div>
      </header>
      <motion.section className={styles.heroStrip} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}>
        <div><strong>13 games</strong><span> • </span><span>New challenges every session</span></div>
        <div className={styles.live}><i /> LIVE ARCADE</div>
      </motion.section>
      <GamesCarousel />
    </main>
  );
}
