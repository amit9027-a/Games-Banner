import { useRef, useState, useEffect } from "react";
import GameCard from "./GameCard.jsx";
import CarouselDots from "./CarouselDots.jsx";
import styles from "./GamesCarousel.module.css";
import { games } from "../../data/gamesData.js";

export default function GamesCarousel() {
  const trackRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = trackRef.current;

    if (!element || paused) return;

    let animationFrame;
    let lastTime = performance.now();

    const tick = (now) => {
      const delta = Math.min(now - lastTime, 32);
      lastTime = now;

      element.scrollLeft += delta * 0.035;

      if (element.scrollLeft + element.clientWidth >= element.scrollWidth - 2) {
        element.scrollLeft = 0;
      }

      animationFrame = requestAnimationFrame(tick);
    };

    animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  useEffect(() => {
    const element = trackRef.current;

    if (!element) return;

    const handleScroll = () => {
      const cards = [...element.children];

      if (!cards.length) return;

      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const distance = Math.abs(card.offsetLeft - element.scrollLeft);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActive(closestIndex);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const go = (index) => {
    const element = trackRef.current;
    const card = element?.children[index];

    if (card) {
      element.scrollTo({
        left: card.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.wrap}>
      <div className={styles.sectionHead}>
        <div>
          <h2>Choose your challenge</h2>
          <p>Swipe or scroll to explore the arcade</p>
        </div>

        <span>13 TITLES</span>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      <CarouselDots
        total={games.length}
        active={active}
        onDotClick={go}
      />
    </section>
  );
}