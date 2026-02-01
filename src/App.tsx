import { useState, useRef } from "react";
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
  const { theme } = useTheme();

  const handleGenerate = async () => {
    setError(null);

    // Check if input is a Pokepaste URL
    let textToParse = teamText;
    if (isPokepastUrl(teamText.trim())) {
      try {
        setIsLoading(true);
        textToParse = await fetchPokepaste(teamText.trim());
        setTeamText(textToParse); // Update textarea with fetched content
      } catch (err) {
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

    const teamWithSprites: PokemonWithSprite[] = await Promise.all(
      team.map(async (pokemon) => {
        let spriteDataUrl = "";
        let typeIconDataUrl: string | null = null;

        const spriteUrl = await fetchPokemonSprite(pokemon.name);
        if (spriteUrl) {
          try {
            spriteDataUrl = await loadImageAsDataUrl(spriteUrl);
          } catch {
            spriteDataUrl = "";
          }
        }

        const typeIconUrl = getTypeIconUrl(pokemon.teraType);
        if (typeIconUrl) {
          try {
            typeIconDataUrl = await loadImageAsDataUrl(typeIconUrl);
          } catch {
            typeIconDataUrl = null;
          }
        }

        // Fetch item sprite - tries PokeAPI (CORS-enabled) first, falls back to Serebii
        let itemSpriteDataUrl: string | null = null;
        let itemSpriteFallbackUrl: string | null = null;
        if (pokemon.item) {
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

    setParsedTeam(teamWithSprites);
    setIsLoading(false);
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

  const handleCopyToClipboard = async (): Promise<boolean> => {
    if (!teraListRef.current) return false;

    const backgroundColor = theme === "dark" ? "#1a1a1a" : "#ffffff";

    try {
      const canvas = await html2canvas(teraListRef.current, {
        backgroundColor,
        scale: 2,
      });

      return new Promise((resolve) => {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob }),
              ]);
              resolve(true);
            } catch (err) {
              console.error("Failed to copy image to clipboard:", err);
              resolve(false);
            }
          } else {
            resolve(false);
          }
        }, "image/png");
      });
    } catch (err) {
      console.error("Failed to capture image:", err);
      return false;
    }
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
