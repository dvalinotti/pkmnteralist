import { forwardRef, useState } from 'react';
import type { PokemonWithSprite } from '../types';
import { TeraRow } from './TeraRow';
import { TeraCard } from './TeraCard';
import { ViewToggle } from './ViewToggle';
import type { ViewMode } from './ViewToggle';
import { ClipboardIcon, CheckIcon, DownloadIcon } from '../icons';
import { COPY_FEEDBACK_DURATION_MS } from '../constants';
import styles from './TeraList.module.css';

type CopyStatus = 'idle' | 'copied' | 'downloaded';

interface TeraListProps {
  team: PokemonWithSprite[];
  isLoading: boolean;
  viewMode: ViewMode;
  onViewToggle: () => void;
  onCopyToClipboard: () => Promise<boolean | 'downloaded'>;
  showOTS: boolean;
  onOTSToggle: () => void;
  showEVs: boolean;
  onEVsToggle: () => void;
}

export const TeraList = forwardRef<HTMLDivElement, TeraListProps>(function TeraList(
  {
    team,
    isLoading,
    viewMode,
    onViewToggle,
    onCopyToClipboard,
    showOTS,
    onOTSToggle,
    showEVs,
    onEVsToggle,
  },
  ref
) {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  const handleCopy = async () => {
    const result = await onCopyToClipboard();
    if (result === true) {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    } else if (result === 'downloaded') {
      setCopyStatus('downloaded');
      setTimeout(() => setCopyStatus('idle'), COPY_FEEDBACK_DURATION_MS);
    }
  };

  const containerClasses = [
    styles.teraContainer,
    viewMode === 'list' ? styles.teraList : styles.teraGrid,
    showOTS ? styles.otsMode : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.resultsSection}>
      <div className={styles.resultsHeader}>
        <h2>{showOTS ? 'Open Team Sheet' : 'Team Tera Types'}</h2>
        {team.length > 0 && !isLoading && (
          <div className={styles.resultsActions}>
            <label className={styles.otsToggle}>
              <input type='checkbox' checked={showOTS} onChange={onOTSToggle} />
              <span>Display full OTS</span>
            </label>
            {showOTS && (
              <label className={styles.otsToggle}>
                <input type='checkbox' checked={showEVs} onChange={onEVsToggle} />
                <span>Show EVs/IVs</span>
              </label>
            )}
            <ViewToggle viewMode={viewMode} onToggle={onViewToggle} />
            <button
              className={`${styles.copyBtn} ${copyStatus !== 'idle' ? styles.success : ''}`}
              onClick={handleCopy}
              disabled={copyStatus !== 'idle'}
              aria-live='polite'
              aria-label={
                copyStatus === 'copied'
                  ? 'Copied to clipboard'
                  : copyStatus === 'downloaded'
                    ? 'Downloaded as image'
                    : 'Copy to clipboard'
              }
            >
              {copyStatus === 'copied' && <CheckIcon />}
              {copyStatus === 'downloaded' && <DownloadIcon />}
              {copyStatus === 'idle' && <ClipboardIcon />}
              <span aria-hidden={copyStatus !== 'idle'}>
                {copyStatus === 'copied' && 'Copied!'}
                {copyStatus === 'downloaded' && 'Downloaded!'}
                {copyStatus === 'idle' && 'Copy to Clipboard'}
              </span>
            </button>
          </div>
        )}
      </div>
      {isLoading ? (
        <p className={styles.loading}>Loading sprites...</p>
      ) : team.length === 0 ? (
        <p className={styles.noResults}>
          No Pokemon found. Make sure your team is in Pokemon Showdown format.
        </p>
      ) : (
        <div className={containerClasses} ref={ref}>
          {team.map((pokemon) =>
            viewMode === 'list' ? (
              <TeraRow key={pokemon.name} pokemon={pokemon} showOTS={showOTS} showEVs={showEVs} />
            ) : (
              <TeraCard key={pokemon.name} pokemon={pokemon} showOTS={showOTS} showEVs={showEVs} />
            )
          )}
        </div>
      )}
    </div>
  );
});
