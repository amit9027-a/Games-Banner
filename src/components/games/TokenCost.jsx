import styles from "./TokenCost.module.css";

export default function TokenCost({ cost }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon}>🪙</span>
      <span className={styles.text}>{cost} Tokens</span>
    </div>
  );
}
