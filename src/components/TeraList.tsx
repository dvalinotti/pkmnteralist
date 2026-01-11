import { forwardRef } from 'react';
import type { PokemonWithSprite } from '../types';
import { TeraRow } from './TeraRow';
import { TeraCard } from './TeraCard';
import { ViewToggle } from './ViewToggle';
import type { ViewMode } from './ViewToggle';

interface TeraListProps {
  team: PokemonWithSprite[];
  isLoading: boolean;
  viewMode: ViewMode;
  onViewToggle: () => void;
  onDownload: (format: 'png' | 'jpg') => void;
}

export const TeraList = forwardRef<HTMLDivElement, TeraListProps>(
  function TeraList({ team, isLoading, viewMode, onViewToggle, onDownload }, ref) {
    return (
      <div className="results-section">
        <div className="results-header">
          <h2>Team Tera Types</h2>
          {team.length > 0 && !isLoading && (
            <div className="results-actions">
              <ViewToggle viewMode={viewMode} onToggle={onViewToggle} />
              <div className="download-buttons">
                <button
                  className="download-btn"
                  onClick={() => onDownload('png')}
                >
                  Download PNG
                </button>
                <button
                  className="download-btn"
                  onClick={() => onDownload('jpg')}
                >
                  Download JPG
                </button>
              </div>
            </div>
          )}
        </div>
        {isLoading ? (
          <p className="loading">Loading sprites...</p>
        ) : team.length === 0 ? (
          <p className="no-results">
            No Pokemon found. Make sure your team is in Pokemon Showdown format.
          </p>
        ) : (
          <div className={`tera-container tera-${viewMode}`} ref={ref}>
            {team.map((pokemon, index) =>
              viewMode === 'list' ? (
                <TeraRow key={index} pokemon={pokemon} />
              ) : (
                <TeraCard key={index} pokemon={pokemon} />
              )
            )}
          </div>
        )}
      </div>
    );
  }
);
