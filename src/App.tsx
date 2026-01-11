import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { parseTeam } from "./utils/parseTeam";
import type { Pokemon } from "./types";
import { TERA_TYPE_COLORS } from "./types";
import "./App.css";

interface PokemonWithSprite extends Pokemon {
  spriteDataUrl: string;
  typeIconDataUrl: string | null;
}

function App() {
  const [teamText, setTeamText] = useState("");
  const [parsedTeam, setParsedTeam] = useState<PokemonWithSprite[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const teraListRef = useRef<HTMLDivElement>(null);

  const loadImageAsDataUrl = async (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  };

  const fetchPokemonSprite = async (
    pokemonName: string
  ): Promise<string | null> => {
    // Normalize the Pokemon name for the API
    const normalized = pokemonName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${normalized}`
      );
      if (!response.ok) {
        // Try without any special characters
        const simpleNormalized = pokemonName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const retryResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${simpleNormalized}`
        );
        if (!retryResponse.ok) return null;
        const data = await retryResponse.json();
        return data.sprites?.front_default || null;
      }
      const data = await response.json();
      return data.sprites?.front_default || null;
    } catch {
      return null;
    }
  };

  const getTypeIconUrl = (teraType: string): string | null => {
    const validTypes = [
      "bug",
      "dark",
      "dragon",
      "electric",
      "fairy",
      "fighting",
      "fire",
      "flying",
      "ghost",
      "grass",
      "ground",
      "ice",
      "normal",
      "poison",
      "psychic",
      "rock",
      "steel",
      "water",
    ];
    const normalizedType = teraType.toLowerCase();
    if (validTypes.includes(normalizedType)) {
      return `https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${normalizedType}.svg`;
    }
    return null;
  };

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

        // Fetch sprite URL from PokeAPI
        const spriteUrl = await fetchPokemonSprite(pokemon.name);
        if (spriteUrl) {
          try {
            spriteDataUrl = await loadImageAsDataUrl(spriteUrl);
          } catch {
            spriteDataUrl = "";
          }
        }

        // Fetch type icon
        const typeIconUrl = getTypeIconUrl(pokemon.teraType);
        if (typeIconUrl) {
          try {
            typeIconDataUrl = await loadImageAsDataUrl(typeIconUrl);
          } catch {
            typeIconDataUrl = null;
          }
        }

        return {
          ...pokemon,
          spriteDataUrl,
          typeIconDataUrl,
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

  const handleDownload = async (format: "png" | "jpg") => {
    if (!teraListRef.current) return;

    const canvas = await html2canvas(teraListRef.current, {
      backgroundColor: "#1a1a1a",
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

  const getTeraColor = (teraType: string): string => {
    return TERA_TYPE_COLORS[teraType] || "#888888";
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Pokemon Tera List</h1>
        <p className="subtitle">
          Paste your Pokemon Showdown team to generate a Tera type visual
        </p>
      </header>

      <main className="main">
        <div className="input-section">
          <textarea
            className="team-input"
            placeholder={`Paste your Pokemon Showdown team here...

Example:
Pikachu @ Light Ball
Ability: Static
Tera Type: Electric
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Surf
- Grass Knot
- Volt Switch`}
            value={teamText}
            onChange={(e) => setTeamText(e.target.value)}
          />
          <div className="button-group">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={!teamText.trim() || isLoading}
            >
              {isLoading ? "Loading..." : "Generate Tera List"}
            </button>
            <button className="clear-btn" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>

        {showResults && (
          <div className="results-section">
            <div className="results-header">
              <h2>Team Tera Types</h2>
              {parsedTeam.length > 0 && !isLoading && (
                <div className="download-buttons">
                  <button
                    className="download-btn"
                    onClick={() => handleDownload("png")}
                  >
                    Download PNG
                  </button>
                  <button
                    className="download-btn"
                    onClick={() => handleDownload("jpg")}
                  >
                    Download JPG
                  </button>
                </div>
              )}
            </div>
            {isLoading ? (
              <p className="loading">Loading visual tera list...</p>
            ) : parsedTeam.length === 0 ? (
              <p className="no-results">
                No Pokemon found. Make sure your team is in Pokemon Showdown
                format.
              </p>
            ) : (
              <div className="tera-list" ref={teraListRef}>
                {parsedTeam.map((pokemon, index) => (
                  <div key={index} className="tera-row">
                    {pokemon.spriteDataUrl ? (
                      <img
                        src={pokemon.spriteDataUrl}
                        alt={pokemon.name}
                        className="pokemon-sprite"
                      />
                    ) : (
                      <div className="pokemon-sprite placeholder" />
                    )}
                    <span className="pokemon-name">{pokemon.name}</span>
                    <div
                      className="tera-badge"
                      style={{
                        backgroundColor: getTeraColor(pokemon.teraType),
                      }}
                    >
                      {pokemon.typeIconDataUrl && (
                        <img
                          src={pokemon.typeIconDataUrl}
                          alt={pokemon.teraType}
                          className="type-icon"
                        />
                      )}
                      {pokemon.teraType}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
