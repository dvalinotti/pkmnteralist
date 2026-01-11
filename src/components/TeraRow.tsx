import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';

interface TeraRowProps {
  pokemon: PokemonWithSprite;
}

export function TeraRow({ pokemon }: TeraRowProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);

  return (
    <div className="tera-row">
      {pokemon.spriteDataUrl ? (
        <img
          src={pokemon.spriteDataUrl}
          alt={pokemon.name}
          className="pokemon-sprite"
        />
      ) : (
        <div className="pokemon-sprite placeholder" />
      )}
      <span className="pokemon-name">{pokemon.name}</span>
      <div
        className="tera-badge"
        style={{ backgroundColor: teraColor }}
      >
        {pokemon.typeIconDataUrl && (
          <img
            src={pokemon.typeIconDataUrl}
            alt={pokemon.teraType}
            className="type-icon"
          />
        )}
        {pokemon.teraType}
      </div>
    </div>
  );
}
