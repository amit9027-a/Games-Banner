import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiTarget, FiZap } from "react-icons/fi";
import styles from "./Game.module.css";
import { useGameCoin } from "../../context/GameCoinContext.jsx";

export default function GameOne() {
  const navigate = useNavigate();
  const { addCoins } = useGameCoin();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [targets, setTargets] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [reviveUsed, setReviveUsed] = useState(false);
  const [reward, setReward] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(() =>
    Number(localStorage.getItem("tap_master_best") || 0)
  );

  const finishRef = useRef(false);

  const finish = useCallback(() => {
    if (finishRef.current) return;

    finishRef.current = true;
    setPlaying(false);
    setTargets([]);
    setReward(Math.floor(score / 20));

    setBest((currentBest) => {
      const newBest = Math.max(currentBest, score);
      localStorage.setItem("tap_master_best", newBest);
      return newBest;
    });

    setGameOver(true);
  }, [score]);

  useEffect(() => {
    if (!playing) return;

    const intervalId = setInterval(() => {
      setTime((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(intervalId);
          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [playing]);

  useEffect(() => {
    if (playing && time === 0) {
      finish();
    }
  }, [time, playing, finish]);

  useEffect(() => {
    if (!playing) return;

    const intervalId = setInterval(() => {
      setTargets((currentTargets) => [
        ...currentTargets.slice(-5),
        {
          id: crypto.randomUUID(),
          x: Math.random() * 82 + 6,
          y: Math.random() * 70 + 10,
          size: Math.random() * 15 + 44,
        },
      ]);
    }, 560);

    return () => clearInterval(intervalId);
  }, [playing]);

  const start = () => {
    finishRef.current = false;
    setScore(0);
    setTime(30);
    setTargets([]);
    setGameOver(false);
    setReviveUsed(false);
    setCombo(0);
    setPlaying(true);
  };

  const hit = (id) => {
    setTargets((currentTargets) =>
      currentTargets.filter((target) => target.id !== id)
    );
    setScore((currentScore) => currentScore + 10);
    setCombo((currentCombo) => currentCombo + 1);
  };

  const revive = () => {
    finishRef.current = false;
    setReviveUsed(true);
    setTime(15);
    setGameOver(false);
    setTargets([]);
    setCombo(0);
    setPlaying(true);
  };

  const leave = () => {
    addCoins(reward);
    navigate("/games/1");
  };

  return (
    <main className={styles.wrap}>
      <div className={styles.top}>
        <button
          onClick={() => navigate("/games/1")}
          className={styles.back}
        >
          <FiArrowLeft /> Exit
        </button>

        <div className={styles.gameTitle}>
          <FiTarget />
          <div>
            <b>Tap Master</b>
            <small>Precision challenge</small>
          </div>
        </div>

        <div className={styles.best}>
          BEST <strong>{best}</strong>
        </div>
      </div>

      <div className={styles.hud}>
        <div>
          <small>SCORE</small>
          <strong>{score}</strong>
        </div>

        <div className={styles.timer}>
          <small>TIME</small>
          <strong>{time}s</strong>
        </div>

        <div>
          <small>COMBO</small>
          <strong>x{combo}</strong>
        </div>
      </div>

      <section
        className={styles.arena}
        aria-label="Tap Master game arena"
      >
        <div className={styles.gridGlow} />

        {targets.map((target) => (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.82 }}
            key={target.id}
            className={styles.target}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: target.size,
              height: target.size,
            }}
            onClick={() => hit(target.id)}
            aria-label="Hit target"
          >
            <span />
            <i />
          </motion.button>
        ))}

        {!playing && !gameOver && (
          <div className={styles.start}>
            <div className={styles.icon}>
              <FiZap />
            </div>
            <h1>Ready?</h1>
            <p>Hit as many targets as possible in 30 seconds.</p>
            <button onClick={start}>Start Game</button>
          </div>
        )}

        {playing && (
          <div className={styles.tip}>TAP THE GLOWING TARGETS</div>
        )}
      </section>

      <div className={styles.footer}>
        <span>+10 points per hit</span>
        <span>Faster targets = higher combo</span>
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.modal}
              initial={{ y: 25, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className={styles.trophy}>🏆</div>
              <span className={styles.overline}>RUN COMPLETE</span>
              <h2>Great run!</h2>

              <div className={styles.result}>
                <div>
                  <small>SCORE</small>
                  <b>{score}</b>
                </div>

                <div>
                  <small>REWARD</small>
                  <b>+{reward} 🪙</b>
                </div>
              </div>

              <p>Use your reward on the redemption screen.</p>

              {!reviveUsed && (
                <button className={styles.revive} onClick={revive}>
                  ⚡ Revive · +15 sec
                </button>
              )}

              <button className={styles.continue} onClick={leave}>
                {reviveUsed ? "Collect Reward" : "Collect & Exit"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}