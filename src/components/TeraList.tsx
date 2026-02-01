import { forwardRef, useState } from "react";
import type { PokemonWithSprite } from "../types";
import { TeraRow } from "./TeraRow";
import { TeraCard } from "./TeraCard";
import { ViewToggle } from "./ViewToggle";
import type { ViewMode } from "./ViewToggle";
import styles from "./TeraList.module.css";

const ClipboardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface TeraListProps {
  team: PokemonWithSprite[];
  isLoading: boolean;
  viewMode: ViewMode;
  onViewToggle: () => void;
  onCopyToClipboard: () => Promise<boolean>;
  showOTS: boolean;
  onOTSToggle: () => void;
  showEVs: boolean;
  onEVsToggle: () => void;
}

export const TeraList = forwardRef<HTMLDivElement, TeraListProps>(
  function TeraList(
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
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      const success = await onCopyToClipboard();
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

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
              {showOTS && (
                <label className={styles.otsToggle}>
                  <input
                    type="checkbox"
                    checked={showEVs}
                    onChange={onEVsToggle}
                  />
                  <span>Show EVs/IVs</span>
                </label>
              )}
              <ViewToggle viewMode={viewMode} onToggle={onViewToggle} />
              <button
                className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
                onClick={handleCopy}
                disabled={copied}
              >
                {copied ? <CheckIcon /> : <ClipboardIcon />}
                {copied ? "Copied!" : "Copy to Clipboard"}
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
            {team.map((pokemon, index) =>
              viewMode === "list" ? (
                <TeraRow key={index} pokemon={pokemon} showOTS={showOTS} showEVs={showEVs} />
              ) : (
                <TeraCard key={index} pokemon={pokemon} showOTS={showOTS} showEVs={showEVs} />
              )
            )}
          </div>
        )}
      </div>
    );
  }
);
