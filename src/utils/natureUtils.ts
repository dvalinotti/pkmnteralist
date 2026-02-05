// Nature stat modifiers for Pokemon
// Each nature boosts one stat (+10%) and lowers another (-10%)
// Neutral natures have no effect

export type StatKey = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export interface NatureModifier {
  boosted: StatKey | null;
  lowered: StatKey | null;
}

export const NATURE_MODIFIERS: Record<string, NatureModifier> = {
  // Neutral natures (no change)
  Hardy: { boosted: null, lowered: null },
  Docile: { boosted: null, lowered: null },
  Serious: { boosted: null, lowered: null },
  Bashful: { boosted: null, lowered: null },
  Quirky: { boosted: null, lowered: null },

  // Attack boosting
  Lonely: { boosted: 'atk', lowered: 'def' },
  Brave: { boosted: 'atk', lowered: 'spe' },
  Adamant: { boosted: 'atk', lowered: 'spa' },
  Naughty: { boosted: 'atk', lowered: 'spd' },

  // Defense boosting
  Bold: { boosted: 'def', lowered: 'atk' },
  Relaxed: { boosted: 'def', lowered: 'spe' },
  Impish: { boosted: 'def', lowered: 'spa' },
  Lax: { boosted: 'def', lowered: 'spd' },

  // Special Attack boosting
  Modest: { boosted: 'spa', lowered: 'atk' },
  Mild: { boosted: 'spa', lowered: 'def' },
  Quiet: { boosted: 'spa', lowered: 'spe' },
  Rash: { boosted: 'spa', lowered: 'spd' },

  // Special Defense boosting
  Calm: { boosted: 'spd', lowered: 'atk' },
  Gentle: { boosted: 'spd', lowered: 'def' },
  Sassy: { boosted: 'spd', lowered: 'spe' },
  Careful: { boosted: 'spd', lowered: 'spa' },

  // Speed boosting
  Timid: { boosted: 'spe', lowered: 'atk' },
  Hasty: { boosted: 'spe', lowered: 'def' },
  Jolly: { boosted: 'spe', lowered: 'spa' },
  Naive: { boosted: 'spe', lowered: 'spd' },
};

export function getNatureModifier(nature: string | null): NatureModifier {
  if (!nature) {
    return { boosted: null, lowered: null };
  }
  return NATURE_MODIFIERS[nature] || { boosted: null, lowered: null };
}

export function getStatModifierClass(
  stat: StatKey,
  nature: string | null
): 'boosted' | 'lowered' | null {
  const modifier = getNatureModifier(nature);
  if (modifier.boosted === stat) return 'boosted';
  if (modifier.lowered === stat) return 'lowered';
  return null;
}
