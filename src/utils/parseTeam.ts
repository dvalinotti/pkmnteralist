import { Teams } from '@pkmn/sets';
import type { Pokemon, StatSpread } from '../types';

const DEFAULT_EVS: StatSpread = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
const DEFAULT_IVS: StatSpread = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

export function parseTeam(teamText: string): Pokemon[] {
  const team = Teams.importTeam(teamText);

  if (!team) {
    return [];
  }

  return team.team.map((set) => ({
    name: set.species || 'Unknown',
    teraType: set.teraType || 'Unknown',
    item: set.item || null,
    ability: set.ability || null,
    moves: set.moves || [],
    nature: set.nature || null,
    level: set.level || 100,
    evs: set.evs ? { ...DEFAULT_EVS, ...set.evs } : DEFAULT_EVS,
    ivs: set.ivs ? { ...DEFAULT_IVS, ...set.ivs } : DEFAULT_IVS,
  }));
}
