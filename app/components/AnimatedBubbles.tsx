import styles from './AnimatedBubbles.module.css';

export function AnimatedBubbles() {
  return (
    <section className="absolute inset-0">
      <div className={styles['bubbles']}>
        {Array.from({length: 10}).map((_, index) => (
          <div key={index} className={styles['bubble']}></div>
        ))}
      </div>
    </section>
  );
}
