import type { StatSpread } from '../types';
import { getStatModifierClass, type StatKey } from '../utils/natureUtils';
import styles from './StatGrid.module.css';

interface StatGridProps {
  evs: StatSpread;
  ivs: StatSpread;
  nature: string | null;
}

const STAT_LABELS: { key: StatKey; label: string }[] = [
  { key: 'hp', label: 'HP' },
  { key: 'atk', label: 'Atk' },
  { key: 'def', label: 'Def' },
  { key: 'spa', label: 'SpA' },
  { key: 'spd', label: 'SpD' },
  { key: 'spe', label: 'Spe' },
];

export function StatGrid({ evs, ivs, nature }: StatGridProps) {
  return (
    <div className={styles.statGrid}>
      <div className={styles.statRow}>
        <span className={styles.statLabel}></span>
        {STAT_LABELS.map(({ key, label }) => {
          const modifierClass = getStatModifierClass(key, nature);
          return (
            <span
              key={key}
              className={`${styles.statHeader} ${modifierClass ? styles[modifierClass] : ''}`}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>EVs</span>
        {STAT_LABELS.map(({ key }) => {
          const modifierClass = getStatModifierClass(key, nature);
          const value = evs[key];
          return (
            <span
              key={key}
              className={`${styles.statValue} ${modifierClass ? styles[modifierClass] : ''} ${value > 0 ? styles.hasValue : ''}`}
            >
              {value}
            </span>
          );
        })}
      </div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>IVs</span>
        {STAT_LABELS.map(({ key }) => {
          const modifierClass = getStatModifierClass(key, nature);
          const value = ivs[key];
          return (
            <span
              key={key}
              className={`${styles.statValue} ${modifierClass ? styles[modifierClass] : ''} ${value < 31 ? styles.notMax : ''}`}
            >
              {value}
            </span>
          );
        })}
      </div>
    </div>
  );
}
