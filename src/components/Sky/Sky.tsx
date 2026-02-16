import styles from './Sky.module.css';

type Props = {
  weather?: 'sunny' | 'rainy';
  children: React.ReactNode;
};

export default function Sky({ weather = 'sunny', children }: Props) {
  return (
    <div className={`${styles.sky} ${weather === 'rainy' ? styles.rainy : styles.sunny}`}>
      {weather === 'sunny' && <div className={styles.sun} style={{ display: 'none' }}></div>}
      {weather === 'rainy' && (
        <div className={styles.rainContainer}>
          {/* Simple rain effect could be added here */}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
