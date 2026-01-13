import { forwardRef } from "react";
import type { PokemonWithSprite } from "../types";
import { TeraRow } from "./TeraRow";
import { TeraCard } from "./TeraCard";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";
import styles from "./TeraList.module.css";

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
    const containerClasses = [
      styles.teraContainer,
      viewMode === "list" ? styles.teraList : styles.teraGrid,
      showOTS ? styles.otsMode : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2>{showOTS ? "Open Team Sheet" : "Team Tera Types"}</h2>
          {team.length > 0 && !isLoading && (
            <div className={styles.resultsActions}>
              <label className={styles.otsToggle}>
                <input
                  type="checkbox"
                  checked={showOTS}
                  onChange={onOTSToggle}
                />
                <span>Display full OTS</span>
              </label>
              <ViewToggle viewMode={viewMode} onToggle={onViewToggle} />
              <div className={styles.downloadButtons}>
                <button
                  className={styles.downloadBtn}
                  onClick={() => onDownload("png")}
                >
                  Download PNG
                </button>
                <button
                  className={styles.downloadBtn}
                  onClick={() => onDownload("jpg")}
                >
                  Download JPG
                </button>
              </div>
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
