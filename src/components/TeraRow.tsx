import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';

interface TeraRowProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
}

export function TeraRow({ pokemon, showOTS = false }: TeraRowProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);

  return (
    <div className={`tera-row${showOTS ? ' ots' : ''}`}>
      {pokemon.spriteDataUrl ? (
        <img
          src={pokemon.spriteDataUrl}
          alt={pokemon.name}
          className="pokemon-sprite"
        />
      ) : (
        <div className="pokemon-sprite placeholder" />
      )}
      <div className="pokemon-info">
        <span className="pokemon-name">{pokemon.name}</span>
        {showOTS && pokemon.item && (
          <span className="pokemon-item">@ {pokemon.item}</span>
        )}
        {showOTS && (
          <div className="ots-details">
            {pokemon.ability && (
              <div className="pokemon-ability">{pokemon.ability}</div>
            )}
            {pokemon.moves.length > 0 && (
              <ul className="pokemon-moves">
                {pokemon.moves.map((move, idx) => (
                  <li key={idx}>{move}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
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
