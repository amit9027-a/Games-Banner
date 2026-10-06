import styles from "./PlayNowButton.module.css";
import { FiArrowRight } from "react-icons/fi";

export default function PlayNowButton({
  loading = false,
  disabled = false,
  label = "Play Now",
}) {
  return (
    <button
      className={`${styles.btn} ${disabled ? styles.disabled : ""}`}
      disabled={disabled || loading}
      aria-label={label}
    >
      <span className={styles.text}>{loading ? "Starting..." : label}</span>
      <FiArrowRight className={styles.arrow} />
      {!disabled && <span className={styles.shimmer} />}
    </button>
  );
}
