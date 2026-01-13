import { forwardRef } from "react";
import type { PokemonWithSprite } from "../types";
import { TeraRow } from "./TeraRow";
import { TeraCard } from "./TeraCard";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";

interface TeraListProps {
  team: PokemonWithSprite[];
  isLoading: boolean;
  viewMode: ViewMode;
  onViewToggle: () => void;
  onDownload: (format: "png" | "jpg") => void;
  showOTS: boolean;
  onOTSToggle: () => void;
}

export const TeraList = forwardRef<HTMLDivElement, TeraListProps>(
  function TeraList(
    {
      team,
      isLoading,
      viewMode,
      onViewToggle,
      onDownload,
      showOTS,
      onOTSToggle,
    },
    ref
  ) {
    return (
      <div className="results-section">
        <div className="results-header">
          <h2>{showOTS ? "Open Team Sheet" : "Team Tera Types"}</h2>
          {team.length > 0 && !isLoading && (
            <div className="results-actions">
              <label className="ots-toggle">
                <input
                  type="checkbox"
                  checked={showOTS}
                  onChange={onOTSToggle}
                />
                <span>Display full OTS</span>
              </label>
              <ViewToggle viewMode={viewMode} onToggle={onViewToggle} />
              <div className="download-buttons">
                <button
                  className="download-btn"
                  onClick={() => onDownload("png")}
                >
                  Download PNG
                </button>
                <button
                  className="download-btn"
                  onClick={() => onDownload("jpg")}
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
          <div
            className={`tera-container tera-${viewMode}${
              showOTS ? " ots-mode" : ""
            }`}
            ref={ref}
          >
            {team.map((pokemon, index) =>
              viewMode === "list" ? (
                <TeraRow key={index} pokemon={pokemon} showOTS={showOTS} />
              ) : (
                <TeraCard key={index} pokemon={pokemon} showOTS={showOTS} />
              )
            )}
          </div>
        )}
      </div>
    );
  }
);
