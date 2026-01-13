import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';
import styles from './TeraRow.module.css';
import sharedStyles from '../styles/shared.module.css';

interface TeraRowProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
}

export function TeraRow({ pokemon, showOTS = false }: TeraRowProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);

  return (
    <div className={`${styles.teraRow}${showOTS ? ` ${styles.ots}` : ''}`}>
      {pokemon.spriteDataUrl ? (
        <img
          src={pokemon.spriteDataUrl}
          alt={pokemon.name}
          className={sharedStyles.pokemonSprite}
        />
      ) : (
        <div className={`${sharedStyles.pokemonSprite} ${sharedStyles.placeholder}`} />
      )}
      <div className={styles.pokemonInfo}>
        <span className={sharedStyles.pokemonName}>{pokemon.name}</span>
        {showOTS && pokemon.item && (
          <span className={sharedStyles.pokemonItem}>
            {pokemon.itemSpriteUrl && (
              <img
                src={pokemon.itemSpriteUrl}
                alt={pokemon.item}
                className={sharedStyles.itemSprite}
              />
            )}
            {pokemon.item}
          </span>
        )}
        {showOTS && (
          <div className={styles.otsDetails}>
            {pokemon.ability && (
              <div className={sharedStyles.pokemonAbility}>{pokemon.ability}</div>
            )}
            {pokemon.moves.length > 0 && (
              <ul className={sharedStyles.pokemonMoves}>
                {pokemon.moves.map((move, idx) => (
                  <li key={idx}>{move}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div
        className={sharedStyles.teraBadge}
        style={{ backgroundColor: teraColor }}
      >
        {pokemon.typeIconDataUrl && (
          <img
            src={pokemon.typeIconDataUrl}
            alt={pokemon.teraType}
            className={sharedStyles.typeIcon}
          />
        )}
        {pokemon.teraType}
      </div>
    </div>
  );
}
