export const loadImageAsDataUrl = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
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
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

// Special form name mappings for PokeAPI
// Maps Pokemon Showdown names to PokeAPI names
const FORM_MAPPINGS: Record<string, string> = {
  // Therian/Incarnate forms
  'landorus-incarnate': 'landorus-incarnate',
  'landorus-therian': 'landorus-therian',
  'tornadus-incarnate': 'tornadus-incarnate',
  'tornadus-therian': 'tornadus-therian',
  'thundurus-incarnate': 'thundurus-incarnate',
  'thundurus-therian': 'thundurus-therian',
  'enamorus-incarnate': 'enamorus-incarnate',
  'enamorus-therian': 'enamorus-therian',

  // Rotom forms
  'rotom-heat': 'rotom-heat',
  'rotom-wash': 'rotom-wash',
  'rotom-frost': 'rotom-frost',
  'rotom-fan': 'rotom-fan',
  'rotom-mow': 'rotom-mow',

  // Deoxys forms
  'deoxys-attack': 'deoxys-attack',
  'deoxys-defense': 'deoxys-defense',
  'deoxys-speed': 'deoxys-speed',
  'deoxys-normal': 'deoxys-normal',

  // Wormadam forms
  'wormadam-plant': 'wormadam-plant',
  'wormadam-sandy': 'wormadam-sandy',
  'wormadam-trash': 'wormadam-trash',

  // Shaymin forms
  'shaymin-land': 'shaymin-land',
  'shaymin-sky': 'shaymin-sky',

  // Giratina forms
  'giratina-altered': 'giratina-altered',
  'giratina-origin': 'giratina-origin',

  // Basculin forms
  'basculin-red-striped': 'basculin-red-striped',
  'basculin-blue-striped': 'basculin-blue-striped',
  'basculin-white-striped': 'basculin-white-striped',

  // Darmanitan forms
  'darmanitan-standard': 'darmanitan-standard',
  'darmanitan-zen': 'darmanitan-zen',
  'darmanitan-galar': 'darmanitan-galar',
  'darmanitan-galar-zen': 'darmanitan-galar-zen',

  // Kyurem forms
  'kyurem-white': 'kyurem-white',
  'kyurem-black': 'kyurem-black',

  // Keldeo forms
  'keldeo-ordinary': 'keldeo-ordinary',
  'keldeo-resolute': 'keldeo-resolute',

  // Meloetta forms
  'meloetta-aria': 'meloetta-aria',
  'meloetta-pirouette': 'meloetta-pirouette',

  // Aegislash forms
  'aegislash-shield': 'aegislash-shield',
  'aegislash-blade': 'aegislash-blade',

  // Pumpkaboo/Gourgeist sizes
  'pumpkaboo-small': 'pumpkaboo-small',
  'pumpkaboo-average': 'pumpkaboo-average',
  'pumpkaboo-large': 'pumpkaboo-large',
  'pumpkaboo-super': 'pumpkaboo-super',
  'gourgeist-small': 'gourgeist-small',
  'gourgeist-average': 'gourgeist-average',
  'gourgeist-large': 'gourgeist-large',
  'gourgeist-super': 'gourgeist-super',

  // Hoopa forms
  'hoopa-confined': 'hoopa',
  'hoopa-unbound': 'hoopa-unbound',

  // Oricorio forms
  'oricorio-baile': 'oricorio-baile',
  'oricorio-pom-pom': 'oricorio-pom-pom',
  'oricorio-pau': 'oricorio-pau',
  'oricorio-sensu': 'oricorio-sensu',

  // Lycanroc forms
  'lycanroc-midday': 'lycanroc-midday',
  'lycanroc-midnight': 'lycanroc-midnight',
  'lycanroc-dusk': 'lycanroc-dusk',

  // Wishiwashi forms
  'wishiwashi-solo': 'wishiwashi-solo',
  'wishiwashi-school': 'wishiwashi-school',

  // Minior forms
  'minior-meteor': 'minior-red-meteor',
  'minior-core': 'minior-red',

  // Mimikyu forms
  'mimikyu-disguised': 'mimikyu-disguised',
  'mimikyu-busted': 'mimikyu-busted',

  // Necrozma forms
  'necrozma-dusk-mane': 'necrozma-dusk',
  'necrozma-dawn-wings': 'necrozma-dawn',
  'necrozma-ultra': 'necrozma-ultra',

  // Toxtricity forms
  'toxtricity-amped': 'toxtricity-amped',
  'toxtricity-low-key': 'toxtricity-low-key',

  // Eiscue forms
  'eiscue-ice': 'eiscue-ice',
  'eiscue-noice': 'eiscue-noice',

  // Indeedee forms
  'indeedee-male': 'indeedee-male',
  'indeedee-female': 'indeedee-female',
  'indeedee-m': 'indeedee-male',
  'indeedee-f': 'indeedee-female',

  // Morpeko forms
  'morpeko-full-belly': 'morpeko-full-belly',
  'morpeko-hangry': 'morpeko-hangry',

  // Zacian/Zamazenta forms
  'zacian-crowned': 'zacian-crowned',
  'zacian-hero': 'zacian',
  'zamazenta-crowned': 'zamazenta-crowned',
  'zamazenta-hero': 'zamazenta',

  // Eternatus forms
  'eternatus-eternamax': 'eternatus-eternamax',

  // Urshifu forms
  'urshifu-single-strike': 'urshifu-single-strike',
  'urshifu-rapid-strike': 'urshifu-rapid-strike',

  // Calyrex forms
  'calyrex-ice-rider': 'calyrex-ice',
  'calyrex-shadow-rider': 'calyrex-shadow',
  'calyrex-ice': 'calyrex-ice',
  'calyrex-shadow': 'calyrex-shadow',

  // Basculegion forms
  'basculegion-male': 'basculegion-male',
  'basculegion-female': 'basculegion-female',
  'basculegion-m': 'basculegion-male',
  'basculegion-f': 'basculegion-female',

  // Oinkologne forms
  'oinkologne-male': 'oinkologne-male',
  'oinkologne-female': 'oinkologne-female',
  'oinkologne-m': 'oinkologne-male',
  'oinkologne-f': 'oinkologne-female',

  // Palafin forms
  'palafin-zero': 'palafin-zero',
  'palafin-hero': 'palafin-hero',

  // Tatsugiri forms
  'tatsugiri-curly': 'tatsugiri-curly',
  'tatsugiri-droopy': 'tatsugiri-droopy',
  'tatsugiri-stretchy': 'tatsugiri-stretchy',

  // Dudunsparce forms
  'dudunsparce-two-segment': 'dudunsparce-two-segment',
  'dudunsparce-three-segment': 'dudunsparce-three-segment',

  // Gimmighoul forms
  'gimmighoul-chest': 'gimmighoul',
  'gimmighoul-roaming': 'gimmighoul-roaming',

  // Squawkabilly forms
  'squawkabilly-green-plumage': 'squawkabilly-green-plumage',
  'squawkabilly-blue-plumage': 'squawkabilly-blue-plumage',
  'squawkabilly-yellow-plumage': 'squawkabilly-yellow-plumage',
  'squawkabilly-white-plumage': 'squawkabilly-white-plumage',

  // Ogerpon forms
  'ogerpon-teal-mask': 'ogerpon',
  'ogerpon-wellspring-mask': 'ogerpon-wellspring-mask',
  'ogerpon-hearthflame-mask': 'ogerpon-hearthflame-mask',
  'ogerpon-cornerstone-mask': 'ogerpon-cornerstone-mask',
  'ogerpon-teal': 'ogerpon',
  'ogerpon-wellspring': 'ogerpon-wellspring-mask',
  'ogerpon-hearthflame': 'ogerpon-hearthflame-mask',
  'ogerpon-cornerstone': 'ogerpon-cornerstone-mask',

  // Terapagos forms
  'terapagos-normal': 'terapagos-normal',
  'terapagos-terastal': 'terapagos-terastal',
  'terapagos-stellar': 'terapagos-stellar',

  // Meowstic forms
  'meowstic-male': 'meowstic-male',
  'meowstic-female': 'meowstic-female',
  'meowstic-m': 'meowstic-male',
  'meowstic-f': 'meowstic-female',

  // Zygarde forms
  'zygarde-10': 'zygarde-10',
  'zygarde-50': 'zygarde-50',
  'zygarde-complete': 'zygarde-complete',

  // Gastrodon forms
  'gastrodon-west': 'gastrodon-west',
  'gastrodon-east': 'gastrodon-east',

  // Shellos forms
  'shellos-west': 'shellos-west',
  'shellos-east': 'shellos-east',

  // Sawsbuck/Deerling forms
  'sawsbuck-spring': 'sawsbuck-spring',
  'sawsbuck-summer': 'sawsbuck-summer',
  'sawsbuck-autumn': 'sawsbuck-autumn',
  'sawsbuck-winter': 'sawsbuck-winter',
  'deerling-spring': 'deerling-spring',
  'deerling-summer': 'deerling-summer',
  'deerling-autumn': 'deerling-autumn',
  'deerling-winter': 'deerling-winter',

  // Flabebe/Floette/Florges forms
  'flabebe-red': 'flabebe-red',
  'flabebe-yellow': 'flabebe-yellow',
  'flabebe-orange': 'flabebe-orange',
  'flabebe-blue': 'flabebe-blue',
  'flabebe-white': 'flabebe-white',
  'floette-red': 'floette-red',
  'floette-yellow': 'floette-yellow',
  'floette-orange': 'floette-orange',
  'floette-blue': 'floette-blue',
  'floette-white': 'floette-white',
  'florges-red': 'florges-red',
  'florges-yellow': 'florges-yellow',
  'florges-orange': 'florges-orange',
  'florges-blue': 'florges-blue',
  'florges-white': 'florges-white',
};

// Regional form prefixes to handle
const REGIONAL_PREFIXES = ['alola', 'alolan', 'galar', 'galarian', 'hisui', 'hisuian', 'paldea', 'paldean'];

/**
 * Normalizes a Pokemon name from Pokemon Showdown format to PokeAPI format
 */
const normalizePokemonName = (name: string): string => {
  let normalized = name.toLowerCase().trim();

  // Handle regional forms (e.g., "Alolan Ninetales" -> "ninetales-alola")
  for (const prefix of REGIONAL_PREFIXES) {
    const prefixPattern = new RegExp(`^${prefix}[\\s-]?`, 'i');
    if (prefixPattern.test(normalized)) {
      const baseName = normalized.replace(prefixPattern, '').trim();
      const region = prefix.replace(/n$/, ''); // Remove trailing 'n' from 'alolan' etc.
      normalized = `${baseName}-${region}`;
      break;
    }
  }

  // Clean up special characters but preserve hyphens
  normalized = normalized
    .replace(/['']/g, '')  // Remove apostrophes (Mr. Mime, etc.)
    .replace(/[.]/g, '')   // Remove periods
    .replace(/[:]/g, '')   // Remove colons
    .replace(/[^a-z0-9-]/g, '-') // Replace other special chars with hyphens
    .replace(/-+/g, '-')   // Remove duplicate hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  // Check if we have a direct mapping for this form
  if (FORM_MAPPINGS[normalized]) {
    return FORM_MAPPINGS[normalized];
  }

  // Handle "Forme" suffix (e.g., "Therian Forme" -> just use the mapping)
  normalized = normalized.replace(/-forme$/, '');
  if (FORM_MAPPINGS[normalized]) {
    return FORM_MAPPINGS[normalized];
  }

  return normalized;
};

export const fetchPokemonSprite = async (pokemonName: string): Promise<string | null> => {
  const normalized = normalizePokemonName(pokemonName);

  try {
    // First try with the normalized name (preserving form hyphens)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalized}`);
    if (response.ok) {
      const data = await response.json();
      return data.sprites?.front_default || null;
    }

    // If that fails, try the base name (remove everything after the first hyphen)
    const baseName = normalized.split('-')[0];
    if (baseName !== normalized) {
      const baseResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${baseName}`);
      if (baseResponse.ok) {
        const data = await baseResponse.json();
        return data.sprites?.front_default || null;
      }
    }

    // Last resort: try removing all hyphens
    const noHyphens = normalized.replace(/-/g, '');
    if (noHyphens !== normalized && noHyphens !== baseName) {
      const noHyphenResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${noHyphens}`);
      if (noHyphenResponse.ok) {
        const data = await noHyphenResponse.json();
        return data.sprites?.front_default || null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

const VALID_TYPES = [
  'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting',
  'fire', 'flying', 'ghost', 'grass', 'ground', 'ice',
  'normal', 'poison', 'psychic', 'rock', 'steel', 'water'
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
