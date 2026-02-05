import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';
import { StatGrid } from './StatGrid';
import styles from './TeraCard.module.css';
import sharedStyles from '../styles/shared.module.css';

interface TeraCardProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
  showEVs?: boolean;
}

export function TeraCard({ pokemon, showOTS = false, showEVs = false }: TeraCardProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);
  // Prefer base64 data URL (works in downloads), fall back to external URL (browser only)
  const itemSpriteUrl = pokemon.itemSpriteDataUrl || pokemon.itemSpriteFallbackUrl;

  if (showOTS) {
    return (
      <div
        className={`${styles.teraCard} ${styles.ots}`}
        style={{ '--tera-color': teraColor } as React.CSSProperties}
      >
        {/* Sprite with circular container and icon overlays */}
        <div className={styles.spriteContainer}>
          <div className={styles.spriteWrapper}>
            <div className={styles.spriteCircle}>
              {pokemon.spriteDataUrl ? (
                <img src={pokemon.spriteDataUrl} alt={pokemon.name} />
              ) : (
                <div className={sharedStyles.placeholder} />
              )}
            </div>
            {/* Tera type icon overlay */}
            {pokemon.typeIconDataUrl && (
              <div className={styles.teraIconOverlay}>
                <img src={pokemon.typeIconDataUrl} alt={pokemon.teraType} />
              </div>
            )}
            {/* Item icon overlay */}
            {itemSpriteUrl && (
              <div className={styles.itemIconOverlay}>
                <img src={itemSpriteUrl} alt={pokemon.item || ''} />
              </div>
            )}
          </div>
          <span className={styles.otsPokemonName}>{pokemon.name}</span>
        </div>

        {/* Info section - Ability and Item */}
        <div className={styles.otsInfo}>
          {pokemon.ability && (
            <div className={styles.otsInfoRow}>
              <span className={styles.otsLabel}>Ability</span>
              <span className={styles.otsValue}>{pokemon.ability}</span>
            </div>
          )}
          {pokemon.item && (
            <div className={styles.otsInfoRow}>
              <span className={styles.otsLabel}>Item</span>
              <span className={styles.otsValue}>
                {itemSpriteUrl && <img src={itemSpriteUrl} alt={pokemon.item} />}
                {pokemon.item}
              </span>
            </div>
          )}
          <div className={styles.otsInfoRow}>
            <span className={styles.otsLabel}>Tera</span>
            <span className={styles.otsValue}>
              <div className={sharedStyles.teraBadge} style={{ backgroundColor: teraColor }}>
                {pokemon.typeIconDataUrl && (
                  <img
                    src={pokemon.typeIconDataUrl}
                    alt={pokemon.teraType}
                    className={sharedStyles.typeIcon}
                  />
                )}
                {pokemon.teraType}
              </div>
            </span>
          </div>
        </div>

        {/* Moves section */}
        {pokemon.moves.length > 0 && (
          <div className={styles.movesSection}>
            <span className={styles.movesLabel}>Moves</span>
            <ul className={styles.movesList}>
              {pokemon.moves.map((move) => (
                <li key={move} className={styles.moveItem}>
                  {move}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats section with nature coloring */}
        {showEVs && (
          <div className={styles.statsSection}>
            {pokemon.nature && <div className={styles.natureLabel}>{pokemon.nature} Nature</div>}
            <StatGrid evs={pokemon.evs} ivs={pokemon.ivs} nature={pokemon.nature} />
          </div>
        )}
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
      <div className={sharedStyles.teraBadge} style={{ backgroundColor: teraColor }}>
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
