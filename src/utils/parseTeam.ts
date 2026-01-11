import { Teams } from '@pkmn/sets';
import type { Pokemon } from '../types';

export function parseTeam(teamText: string): Pokemon[] {
  const team = Teams.importTeam(teamText);

  if (!team) {
    return [];
  }

  return team.team.map((set) => ({
    name: set.species || 'Unknown',
    teraType: set.teraType || 'Unknown',
  }));
}
