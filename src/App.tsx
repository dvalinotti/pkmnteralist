import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { parseTeam } from "./utils/parseTeam";
import {
  loadImageAsDataUrl,
  fetchPokemonSprite,
  getTypeIconUrl,
  fetchItemSprite,
} from "./utils/imageUtils";
import { isPokepastUrl, fetchPokepaste } from "./utils/pokepaste";
import { Header, TeamInput, TeraList } from "./components";
import type { ViewMode } from "./components";
import type { PokemonWithSprite } from "./types";
import { useTheme } from "./context/ThemeContext";
import styles from "./App.module.css";
import { Footer } from "./components/Footer";

function App() {
  const [teamText, setTeamText] = useState("");
  const [parsedTeam, setParsedTeam] = useState<PokemonWithSprite[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showOTS, setShowOTS] = useState(false);
  const [showEVs, setShowEVs] = useState(false);
  const teraListRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { theme } = useTheme();

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleGenerate = async () => {
    // Cancel any in-flight requests from previous generation
    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const signal = abortController.signal;

    setError(null);

    // Check if input is a Pokepaste URL
    let textToParse = teamText;
    if (isPokepastUrl(teamText.trim())) {
      try {
        setIsLoading(true);
        textToParse = await fetchPokepaste(teamText.trim(), signal);
        if (signal.aborted) return;
        setTeamText(textToParse); // Update textarea with fetched content
      } catch (err) {
        if (signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to fetch paste");
        setIsLoading(false);
        return;
      }
    }

    const team = parseTeam(textToParse);
    if (team.length === 0) {
      setParsedTeam([]);
      setShowResults(true);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      const teamWithSprites: PokemonWithSprite[] = await Promise.all(
        team.map(async (pokemon) => {
          let spriteDataUrl = "";
          let typeIconDataUrl: string | null = null;

          const spriteUrl = await fetchPokemonSprite(pokemon.name, signal);
          if (spriteUrl && !signal.aborted) {
            try {
              spriteDataUrl = await loadImageAsDataUrl(spriteUrl);
            } catch {
              spriteDataUrl = "";
            }
          }

          const typeIconUrl = getTypeIconUrl(pokemon.teraType);
          if (typeIconUrl && !signal.aborted) {
            try {
              typeIconDataUrl = await loadImageAsDataUrl(typeIconUrl);
            } catch {
              typeIconDataUrl = null;
            }
          }

          // Fetch item sprite - tries PokeAPI (CORS-enabled) first, falls back to Serebii
          let itemSpriteDataUrl: string | null = null;
          let itemSpriteFallbackUrl: string | null = null;
          if (pokemon.item && !signal.aborted) {
            const itemSprite = await fetchItemSprite(pokemon.item);
            itemSpriteDataUrl = itemSprite.dataUrl;
            itemSpriteFallbackUrl = itemSprite.fallbackUrl;
          }

          return {
            ...pokemon,
            spriteDataUrl,
            typeIconDataUrl,
            itemSpriteDataUrl,
            itemSpriteFallbackUrl,
          };
        })
      );

      if (signal.aborted) return;
      setParsedTeam(teamWithSprites);
    } catch {
      if (signal.aborted) return;
      // Silently handle abort errors
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  const handleClear = () => {
    setTeamText("");
    setParsedTeam([]);
    setShowResults(false);
    setError(null);
  };

  const handleTextChange = (text: string) => {
    setTeamText(text);
    setError(null);
  };

  const handleViewToggle = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const handleOTSToggle = () => {
    setShowOTS((prev) => !prev);
  };

  const handleEVsToggle = () => {
    setShowEVs((prev) => !prev);
  };

  const handleCopyToClipboard = (): Promise<boolean | "downloaded"> => {
    if (!teraListRef.current) return Promise.resolve(false);

    const backgroundColor = theme === "dark" ? "#1a1a1a" : "#ffffff";
    const element = teraListRef.current;

    // Create a promise that resolves to a blob - this allows Safari to work
    // by passing the promise directly to ClipboardItem
    const blobPromise = html2canvas(element, {
      backgroundColor,
      scale: 2,
    }).then(
      (canvas) =>
        new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          }, "image/png");
        })
    );

    // Call clipboard.write synchronously (not awaited) with the blob promise
    // This preserves the user gesture context for Safari
    return navigator.clipboard
      .write([
        new ClipboardItem({
          "image/png": blobPromise,
        }),
      ])
      .then(() => true)
      .catch(async (err) => {
        console.error("Clipboard copy failed, falling back to download:", err);
        // Fallback: download the image instead
        try {
          const blob = await blobPromise;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "tera-list.png";
          link.click();
          URL.revokeObjectURL(url);
          return "downloaded" as const;
        } catch (downloadErr) {
          console.error("Download fallback also failed:", downloadErr);
          return false;
        }
      });
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <TeamInput
          value={teamText}
          onChange={handleTextChange}
          onGenerate={handleGenerate}
          onClear={handleClear}
          isLoading={isLoading}
          error={error}
        />
        {showResults && (
          <TeraList
            ref={teraListRef}
            team={parsedTeam}
            isLoading={isLoading}
            viewMode={viewMode}
            onViewToggle={handleViewToggle}
            onCopyToClipboard={handleCopyToClipboard}
            showOTS={showOTS}
            onOTSToggle={handleOTSToggle}
            showEVs={showEVs}
            onEVsToggle={handleEVsToggle}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
