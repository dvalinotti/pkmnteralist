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

export const fetchPokemonSprite = async (pokemonName: string): Promise<string | null> => {
  const normalized = pokemonName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalized}`);
    if (!response.ok) {
      const simpleNormalized = pokemonName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const retryResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${simpleNormalized}`);
      if (!retryResponse.ok) return null;
      const data = await retryResponse.json();
      return data.sprites?.front_default || null;
    }
    const data = await response.json();
    return data.sprites?.front_default || null;
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
