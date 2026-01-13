import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';
import styles from './TeraCard.module.css';
import sharedStyles from '../styles/shared.module.css';

interface TeraCardProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
}

export function TeraCard({ pokemon, showOTS = false }: TeraCardProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);

  if (showOTS) {
    return (
      <div className={`${styles.teraCard} ${styles.ots}`}>
        <div className={styles.otsLeft}>
          {pokemon.spriteDataUrl ? (
            <img
              src={pokemon.spriteDataUrl}
              alt={pokemon.name}
              className={sharedStyles.pokemonSprite}
            />
          ) : (
            <div className={`${sharedStyles.pokemonSprite} ${sharedStyles.placeholder}`} />
          )}
          <span className={sharedStyles.pokemonName}>{pokemon.name}</span>
          <div className={styles.otsInfo}>
            {pokemon.item && (
              <div className={styles.otsInfoRow}>
                <span className={styles.otsLabel}>Item</span>
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
              </div>
            )}
            {pokemon.ability && (
              <div className={styles.otsInfoRow}>
                <span className={styles.otsLabel}>Ability</span>
                <span className={sharedStyles.pokemonAbility}>{pokemon.ability}</span>
              </div>
            )}
            <div className={styles.otsInfoRow}>
              <span className={styles.otsLabel}>Tera</span>
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
          </div>
        </div>
        <div className={styles.otsRight}>
          {pokemon.moves.length > 0 && (
            <ul className={sharedStyles.pokemonMoves}>
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
    <div className={styles.teraCard}>
      {pokemon.spriteDataUrl ? (
        <img
          src={pokemon.spriteDataUrl}
          alt={pokemon.name}
          className={sharedStyles.pokemonSprite}
        />
      ) : (
        <div className={`${sharedStyles.pokemonSprite} ${sharedStyles.placeholder}`} />
      )}
      <span className={sharedStyles.pokemonName}>{pokemon.name}</span>
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
