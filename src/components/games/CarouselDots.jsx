import styles from "./CarouselDots.module.css";

export default function CarouselDots({ total, active, onDotClick }) {
  return (
    <div
      className={styles.dots}
      role="tablist"
      aria-label="Carousel navigation"
    >
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          className={`${styles.dot} ${i === active ? styles.active : ""}`}
          onClick={() => onDotClick(i)}
          aria-label={`Go to slide ${i + 1}`}
          role="tab"
          aria-selected={i === active}
        />
      ))}
    </div>
  );
}
