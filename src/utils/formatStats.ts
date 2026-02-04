import type { StatSpread } from '../types';

const STAT_NAMES = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'] as const;

/**
 * Formats a stat spread for display, showing only non-default values.
 * For EVs: shows non-zero values, returns "None" if all are 0
 * For IVs: shows non-31 values, returns "All 31" if all are 31
 */
export const formatStatSpread = (stats: StatSpread, isEV: boolean): string => {
  const statValues = [stats.hp, stats.atk, stats.def, stats.spa, stats.spd, stats.spe];
  const defaultValue = isEV ? 0 : 31;

  const nonDefault = statValues
    .map((val, i) => ({ name: STAT_NAMES[i], val }))
    .filter(({ val }) => val !== defaultValue);

  if (nonDefault.length === 0) {
    return isEV ? 'None' : 'All 31';
  }

  return nonDefault.map(({ name, val }) => `${val} ${name}`).join(' / ');
};
