import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';

interface TeraCardProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
}

export function TeraCard({ pokemon, showOTS = false }: TeraCardProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);

  if (showOTS) {
    return (
      <div className="tera-card ots">
        <div className="ots-left">
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
          <div className="ots-info">
            {pokemon.item && (
              <div className="ots-info-row">
                <span className="ots-label">Item</span>
                <span className="pokemon-item">
                  {pokemon.itemSpriteUrl && (
                    <img
                      src={pokemon.itemSpriteUrl}
                      alt={pokemon.item}
                      className="item-sprite"
                    />
                  )}
                  {pokemon.item}
                </span>
              </div>
            )}
            {pokemon.ability && (
              <div className="ots-info-row">
                <span className="ots-label">Ability</span>
                <span className="pokemon-ability">{pokemon.ability}</span>
              </div>
            )}
            <div className="ots-info-row">
              <span className="ots-label">Tera</span>
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
          </div>
        </div>
        <div className="ots-right">
          {pokemon.moves.length > 0 && (
            <ul className="pokemon-moves">
              {pokemon.moves.map((move, idx) => (
                <li key={idx}>{move}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tera-card">
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
