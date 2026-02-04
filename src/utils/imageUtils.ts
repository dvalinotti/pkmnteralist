import { LOCAL_ITEM_SPRITES } from '../assets/items';

export const loadImageAsDataUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
    };

    img.onload = () => {
      cleanup();
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } else {
        reject(new Error('Could not get canvas context'));
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
};

// Maps Showdown base form names to PokeAPI names (when Showdown omits the form suffix)
const BASE_FORM_TO_POKEAPI: Record<string, string> = {
  // Pokemon where Showdown uses base name but PokeAPI requires form suffix
  urshifu: 'urshifu-single-strike',
  toxtricity: 'toxtricity-amped',
  indeedee: 'indeedee-male',
  'indeedee-f': 'indeedee-female',
  basculegion: 'basculegion-male',
  'basculegion-f': 'basculegion-female',
  oinkologne: 'oinkologne-male',
  lycanroc: 'lycanroc-midday',
  oricorio: 'oricorio-baile',
  wormadam: 'wormadam-plant',
  meowstic: 'meowstic-male',
  'meowstic-f': 'meowstic-female',
  deoxys: 'deoxys-normal',
  shaymin: 'shaymin-land',
  giratina: 'giratina-altered',
  basculin: 'basculin-red-striped',
  darmanitan: 'darmanitan-standard',
  'darmanitan-galar': 'darmanitan-galar-standard',
  tornadus: 'tornadus-incarnate',
  thundurus: 'thundurus-incarnate',
  landorus: 'landorus-incarnate',
  enamorus: 'enamorus-incarnate',
  keldeo: 'keldeo-ordinary',
  meloetta: 'meloetta-aria',
  aegislash: 'aegislash-shield',
  pumpkaboo: 'pumpkaboo-average',
  gourgeist: 'gourgeist-average',
  zygarde: 'zygarde-50',
  hoopa: 'hoopa',
  wishiwashi: 'wishiwashi-solo',
  mimikyu: 'mimikyu-disguised',
  eiscue: 'eiscue-ice',
  morpeko: 'morpeko-full-belly',
  tatsugiri: 'tatsugiri-curly',
  'urshifu-gmax': 'urshifu-single-strike-gmax',
  'ogerpon-cornerstone': 'ogerpon-cornerstone-mask',
  'ogerpon-wellspring': 'ogerpon-wellspring-mask',
  'ogerpon-hearthflame': 'ogerpon-hearthflame-mask',
  'necrozma-dusk-mane': 'necrozma-dusk',
  'necrozma-dawn-wings': 'necrozma-dawn',
  'zygarde-10': 'zygarde-10',
  'tauros-paldea-combat': 'tauros-paldea-combat-breed',
  'tauros-paldea-blaze': 'tauros-paldea-blaze-breed',
  'tauros-paldea-aqua': 'tauros-paldea-aqua-breed',
};

/**
 * Normalizes a Pokemon name to PokeAPI format.
 */
const normalizeForPokeAPI = (name: string): string => {
  const normalized = name
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[.]/g, '') // Remove periods
    .replace(/[:]/g, '') // Remove colons
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove other special chars
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Check if this is a base form that needs a suffix for PokeAPI
  if (BASE_FORM_TO_POKEAPI[normalized]) {
    return BASE_FORM_TO_POKEAPI[normalized];
  }

  return normalized;
};

/**
 * Fetches the sprite URL for a Pokemon using PokeAPI.
 * Returns the front_default sprite from the API response.
 */
export const fetchPokemonSprite = async (
  pokemonName: string,
  signal?: AbortSignal
): Promise<string | null> => {
  const normalized = normalizeForPokeAPI(pokemonName);

  try {
    // Query PokeAPI to get Pokemon data
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalized}`, { signal });
    if (response.ok) {
      const data = await response.json();
      return data.sprites?.front_default || null;
    }

    // Try just the base name as fallback (first part before hyphen)
    const baseName = normalized.split('-')[0];
    if (baseName !== normalized) {
      // Check if the base name has a mapping
      const mappedBase = BASE_FORM_TO_POKEAPI[baseName] || baseName;
      const baseResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${mappedBase}`, {
        signal,
      });
      if (baseResponse.ok) {
        const data = await baseResponse.json();
        return data.sprites?.front_default || null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const VALID_TYPES = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
];

export const getTypeIconUrl = (teraType: string): string | null => {
  const normalizedType = teraType.toLowerCase();
  if (VALID_TYPES.includes(normalizedType)) {
    return `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${normalizedType}.svg`;
  }
  return null;
};

export const getTeraColor = (teraType: string, colors: Record<string, string>): string => {
  return colors[teraType] || '#888888';
};

/**
 * Normalizes item name for PokeAPI/GitHub sprites (kebab-case).
 * "Focus Sash" -> "focus-sash"
 */
const normalizeItemForPokeAPI = (itemName: string): string => {
  return itemName
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[.]/g, '') // Remove periods
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove other special chars
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Normalizes item name for Serebii sprites (no hyphens).
 * "Focus Sash" -> "focussash"
 */
const normalizeItemForSerebii = (itemName: string): string => {
  return itemName
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[.]/g, '') // Remove periods
    .replace(/\s+/g, '') // Remove spaces entirely
    .replace(/[^a-z0-9]/g, ''); // Remove all special chars including hyphens
};

/**
 * Gets item sprite URLs. Returns primary (PokeAPI with CORS) and fallback (Serebii).
 */
export const getItemSpriteUrls = (itemName: string): { primary: string; fallback: string } => {
  const pokeApiName = normalizeItemForPokeAPI(itemName);
  const serebiiName = normalizeItemForSerebii(itemName);

  return {
    primary: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${pokeApiName}.png`,
    fallback: `https://www.serebii.net/itemdex/sprites/sv/${serebiiName}.png`,
  };
};

/**
 * Fetches an item sprite and returns it as a base64 data URL.
 * Priority: 1) Local bundled sprites, 2) PokeAPI/GitHub, 3) Serebii URL fallback.
 * Returns { dataUrl, fallbackUrl } - dataUrl is null if no CORS-enabled source available.
 */
export const fetchItemSprite = async (
  itemName: string
): Promise<{ dataUrl: string | null; fallbackUrl: string }> => {
  const pokeApiName = normalizeItemForPokeAPI(itemName);
  const urls = getItemSpriteUrls(itemName);

  // Check for local bundled sprite first (SV-exclusive items)
  const localSprite = LOCAL_ITEM_SPRITES[pokeApiName];
  if (localSprite) {
    try {
      // Local sprites are already bundled, convert to base64 for consistency
      const dataUrl = await loadImageAsDataUrl(localSprite);
      return { dataUrl, fallbackUrl: urls.fallback };
    } catch {
      // Fall through to try other sources
    }
  }

  // Try PokeAPI/GitHub (has CORS support)
  try {
    const dataUrl = await loadImageAsDataUrl(urls.primary);
    return { dataUrl, fallbackUrl: urls.fallback };
  } catch {
    // PokeAPI doesn't have this item, return Serebii URL as fallback
    return { dataUrl: null, fallbackUrl: urls.fallback };
  }
};
