import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { parseTeam } from "./utils/parseTeam";
import {
  loadImageAsDataUrl,
  fetchPokemonSprite,
  getTypeIconUrl,
  getItemSpriteUrl,
} from "./utils/imageUtils";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showOTS, setShowOTS] = useState(false);
  const teraListRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const handleGenerate = async () => {
    const team = parseTeam(teamText);
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

        // Item sprite URL (not converted to base64 due to CORS limitations)
        const itemSpriteUrl = pokemon.item ? getItemSpriteUrl(pokemon.item) : null;

        return {
          ...pokemon,
          spriteDataUrl,
          typeIconDataUrl,
          itemSpriteUrl,
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
  };

  const handleViewToggle = () => {
    setViewMode((prev) => (prev === "list" ? "grid" : "list"));
  };

  const handleOTSToggle = () => {
    setShowOTS((prev) => !prev);
  };

  const handleDownload = async (format: "png" | "jpg") => {
    if (!teraListRef.current) return;

    const backgroundColor = theme === "dark" ? "#1a1a1a" : "#ffffff";

    const canvas = await html2canvas(teraListRef.current, {
      backgroundColor,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = `tera-list.${format}`;
    link.href = canvas.toDataURL(
      format === "jpg" ? "image/jpeg" : "image/png",
      0.95
    );
    link.click();
  };

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        <TeamInput
          value={teamText}
          onChange={setTeamText}
          onGenerate={handleGenerate}
          onClear={handleClear}
          isLoading={isLoading}
        />
        {showResults && (
          <TeraList
            ref={teraListRef}
            team={parsedTeam}
            isLoading={isLoading}
            viewMode={viewMode}
            onViewToggle={handleViewToggle}
            onDownload={handleDownload}
            showOTS={showOTS}
            onOTSToggle={handleOTSToggle}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
