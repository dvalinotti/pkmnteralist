import { isPokepastUrl } from './pokepaste';

export interface ValidationResult {
  isValid: boolean;
  warning?: string;
}

/**
 * Validates team input and provides helpful feedback.
 * Returns { isValid: true } if input looks valid,
 * or { isValid: false, warning: "..." } with a helpful message.
 */
export const validateTeamInput = (input: string): ValidationResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return { isValid: false };
  }

  // Check if it looks like a Pokepaste URL
  if (trimmed.startsWith('http') || trimmed.includes('pokepast.es')) {
    if (isPokepastUrl(trimmed)) {
      return { isValid: true };
    }
    // Looks like a URL but not a valid Pokepaste URL
    return {
      isValid: false,
      warning: 'Invalid Pokepaste URL. URLs should be like: https://pokepast.es/abc123',
    };
  }

  // Check for Pokemon Showdown format indicators
  const hasTeraType = /tera\s*type\s*:/i.test(trimmed);
  const hasAbility = /ability\s*:/i.test(trimmed);
  const hasMoves = /^-\s*\w+/m.test(trimmed);
  const hasAtSymbol = /@/.test(trimmed);
  const hasNature = /\w+\s+nature/i.test(trimmed);

  // If none of these are present, it might not be a valid team format
  if (!hasTeraType && !hasAbility && !hasMoves && !hasAtSymbol && !hasNature) {
    return {
      isValid: false,
      warning:
        'Input does not look like a Pokemon Showdown team. Make sure to include Tera Type for each Pokemon.',
    };
  }

  // Warn if no Tera Type found (since this is a Tera list generator)
  if (!hasTeraType) {
    return {
      isValid: true,
      warning: 'No Tera Type detected. Each Pokemon should have a "Tera Type:" line.',
    };
  }

  return { isValid: true };
};
