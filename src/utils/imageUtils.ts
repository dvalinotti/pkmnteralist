export const loadImageAsDataUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// Maps Showdown base form names to PokeAPI names (when Showdown omits the form suffix)
const BASE_FORM_TO_POKEAPI: Record<string, string> = {
  // Pokemon where Showdown uses base name but PokeAPI requires form suffix
  urshifu: "urshifu-single-strike",
  toxtricity: "toxtricity-amped",
  indeedee: "indeedee-male",
  "indeedee-f": "indeedee-female",
  basculegion: "basculegion-male",
  "basculegion-f": "basculegion-female",
  oinkologne: "oinkologne-male",
  lycanroc: "lycanroc-midday",
  oricorio: "oricorio-baile",
  wormadam: "wormadam-plant",
  meowstic: "meowstic-male",
  "meowstic-f": "meowstic-female",
  deoxys: "deoxys-normal",
  shaymin: "shaymin-land",
  giratina: "giratina-altered",
  basculin: "basculin-red-striped",
  darmanitan: "darmanitan-standard",
  "darmanitan-galar": "darmanitan-galar-standard",
  tornadus: "tornadus-incarnate",
  thundurus: "thundurus-incarnate",
  landorus: "landorus-incarnate",
  enamorus: "enamorus-incarnate",
  keldeo: "keldeo-ordinary",
  meloetta: "meloetta-aria",
  aegislash: "aegislash-shield",
  pumpkaboo: "pumpkaboo-average",
  gourgeist: "gourgeist-average",
  zygarde: "zygarde-50",
  hoopa: "hoopa",
  wishiwashi: "wishiwashi-solo",
  mimikyu: "mimikyu-disguised",
  eiscue: "eiscue-ice",
  morpeko: "morpeko-full-belly",
  "urshifu-gmax": "urshifu-single-strike-gmax",
  "ogerpon-cornerstone": "ogerpon-cornerstone-mask",
  "ogerpon-wellspring": "ogerpon-wellspring-mask",
  "ogerpon-hearthflame": "ogerpon-hearthflame-mask",
  "necrozma-dusk-mane": "necrozma-dusk",
  "necrozma-dawn-wings": "necrozma-dawn",
  "zygarde-10": "zygarde-10",
  "tauros-paldea-combat": "tauros-paldea-combat-breed",
  "tauros-paldea-blaze": "tauros-paldea-blaze-breed",
  "tauros-paldea-aqua": "tauros-paldea-aqua-breed",
};

/**
 * Normalizes a Pokemon name to PokeAPI format.
 */
const normalizeForPokeAPI = (name: string): string => {
  const normalized = name
    .toLowerCase()
    .replace(/['']/g, "") // Remove apostrophes
    .replace(/[.]/g, "") // Remove periods
    .replace(/[:]/g, "") // Remove colons
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove other special chars
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // Check if this is a base form that needs a suffix for PokeAPI
  console.log({ normalized });
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
  pokemonName: string
): Promise<string | null> => {
  const normalized = normalizeForPokeAPI(pokemonName);

  try {
    // Query PokeAPI to get Pokemon data
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${normalized}`
    );
    if (response.ok) {
      const data = await response.json();
      return data.sprites?.front_default || null;
    }

    // Try just the base name as fallback (first part before hyphen)
    const baseName = normalized.split("-")[0];
    if (baseName !== normalized) {
      // Check if the base name has a mapping
      const mappedBase = BASE_FORM_TO_POKEAPI[baseName] || baseName;
      const baseResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${mappedBase}`
      );
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
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

export const getTypeIconUrl = (teraType: string): string | null => {
  const normalizedType = teraType.toLowerCase();
  if (VALID_TYPES.includes(normalizedType)) {
    return `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${normalizedType}.svg`;
  }
  return null;
};

export const getTeraColor = (
  teraType: string,
  colors: Record<string, string>
): string => {
  return colors[teraType] || "#888888";
};

/**
 * Generates the item sprite URL from Serebii.
 * Normalizes item name: "Focus Sash" -> "focussash" (no hyphens)
 * Serebii has the most up-to-date item sprites including Scarlet/Violet items.
 */
export const getItemSpriteUrl = (itemName: string): string => {
  const normalized = itemName
    .toLowerCase()
    .replace(/['']/g, "") // Remove apostrophes
    .replace(/[.]/g, "") // Remove periods
    .replace(/\s+/g, "") // Remove spaces entirely
    .replace(/[^a-z0-9]/g, ""); // Remove all special chars including hyphens

  return `https://www.serebii.net/itemdex/sprites/sv/${normalized}.png`;
};
