import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiClock, FiRotateCcw } from "react-icons/fi";
import styles from "./Game.module.css";
import { useGameCoin } from "../../context/GameCoinContext.jsx";

const EMOJIS = ["🍎","🍌","🍇","🍓","🍒","🥝","🍑","🍍"];
const shuffle = a => [...a].sort(() => Math.random() - .5);
const makeDeck = () => shuffle([...EMOJIS, ...EMOJIS]).map((emoji, i) => ({ id: i, emoji }));

export default function GameTwo() {
  const navigate = useNavigate();
  const { addCoins } = useGameCoin();
  const [cards, setCards] = useState(makeDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [started, gameOver]);

  useEffect(() => {
    if (started && seconds === 0) setGameOver(true);
  }, [seconds, started]);

  useEffect(() => {
    if (flipped.length !== 2) return;
    setLocked(true);
    const [a, b] = flipped;
    setMoves(m => m + 1);
    if (cards[a]?.emoji === cards[b]?.emoji) {
      setTimeout(() => {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
        setLocked(false);
      }, 380);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setLocked(false);
      }, 850);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (started && matched.length === cards.length && cards.length) {
      setTimeout(() => setGameOver(true), 450);
    }
  }, [matched, cards.length, started]);

  const reward = useMemo(() => Math.max(5, 40 - moves * 2), [moves]);

  const start = () => {
    setCards(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(60);
    setGameOver(false);
    setReviveUsed(false);
    setLocked(false);
    setStarted(true);
  };

  const flip = i => {
    if (!started || locked || gameOver || flipped.length >= 2 || flipped.includes(i) || matched.includes(i)) return;
    setFlipped(f => [...f, i]);
  };

  const revive = () => {
    setReviveUsed(true);
    setCards(makeDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(30);
    setGameOver(false);
    setLocked(false);
    setStarted(true);
  };

  const leave = () => {
    addCoins(reward);
    navigate('/games/2');
  };

  return (
    <main className={styles.wrap}>
      <div className={styles.top}>
        <button className={styles.back} onClick={() => navigate('/games/2')}>
          <FiArrowLeft /> Exit
        </button>
        <div className={styles.title}>
          <span>🧠</span>
          <div>
            <b>Memory Match</b>
            <small>Find every pair</small>
          </div>
        </div>
        <div className={styles.best}>
          <FiClock /> {seconds}s
        </div>
      </div>

      <div className={styles.hud}>
        <div><small>PAIRS</small><strong>{matched.length / 2}/{EMOJIS.length}</strong></div>
        <div><small>MOVES</small><strong>{moves}</strong></div>
        <div><small>REWARD</small><strong>+{reward} 🪙</strong></div>
      </div>

      <section className={styles.board}>
        {cards.map((card, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          return (
            <motion.button
              key={card.id}
              className={`${styles.card} ${show ? styles.open : ''} ${matched.includes(i) ? styles.matched : ''}`}
              onClick={() => flip(i)}
              whileHover={!show ? { y: -4 } : undefined}
              whileTap={{ scale: .96 }}
              aria-label={show ? card.emoji : 'Hidden card'}
            >
              <span className={styles.front}>?</span>
              <span className={styles.backFace}>{card.emoji}</span>
            </motion.button>
          );
        })}
      </section>

      {!started && (
        <div className={styles.startArea}>
          <button className={styles.start} onClick={start}>Start Memory Match</button>
          <span>60 seconds · {EMOJIS.length} pairs</span>
        </div>
      )}

      <AnimatePresence>
        {gameOver && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: 20, scale: .97 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className={styles.win}>
                {matched.length === cards.length ? '🎉' : '⏱️'}
              </div>
              <span className={styles.overline}>
                {matched.length === cards.length ? 'BOARD CLEARED' : 'TIME UP'}
              </span>
              <h2>{matched.length === cards.length ? 'Perfect match!' : 'Nice try!'}</h2>
              <div className={styles.result}>
                <div><small>MOVES</small><b>{moves}</b></div>
                <div><small>REWARD</small><b>+{reward} 🪙</b></div>
              </div>
              {!reviveUsed && (
                <button className={styles.revive} onClick={revive}>
                  <FiRotateCcw /> Shuffle & revive · 30 sec
                </button>
              )}
              <button className={styles.continue} onClick={leave}>
                Collect & Exit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}