import type { PokemonWithSprite } from '../types';
import { TERA_TYPE_COLORS } from '../types';
import { getTeraColor } from '../utils/imageUtils';
import { formatStatSpread } from '../utils/formatStats';
import styles from './TeraRow.module.css';
import sharedStyles from '../styles/shared.module.css';

interface TeraRowProps {
  pokemon: PokemonWithSprite;
  showOTS?: boolean;
  showEVs?: boolean;
}

export function TeraRow({ pokemon, showOTS = false, showEVs = false }: TeraRowProps) {
  const teraColor = getTeraColor(pokemon.teraType, TERA_TYPE_COLORS);
  // Prefer base64 data URL (works in downloads), fall back to external URL (browser only)
  const itemSpriteUrl = pokemon.itemSpriteDataUrl || pokemon.itemSpriteFallbackUrl;

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
            {itemSpriteUrl && (
              <img src={itemSpriteUrl} alt={pokemon.item} className={sharedStyles.itemSprite} />
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
                {pokemon.moves.map((move) => (
                  <li key={move}>{move}</li>
                ))}
              </ul>
            )}
            {showEVs && (
              <div className={sharedStyles.pokemonStatsBlock}>
                {pokemon.nature && (
                  <div className={sharedStyles.pokemonNature}>{pokemon.nature} Nature</div>
                )}
                <div className={sharedStyles.pokemonStats}>
                  EVs: {formatStatSpread(pokemon.evs, true)}
                </div>
                <div className={sharedStyles.pokemonStats}>
                  IVs: {formatStatSpread(pokemon.ivs, false)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
