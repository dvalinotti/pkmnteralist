import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { parseTeam } from './utils/parseTeam';
import { loadImageAsDataUrl, fetchPokemonSprite, getTypeIconUrl } from './utils/imageUtils';
import { Header, TeamInput, TeraList } from './components';
import type { PokemonWithSprite } from './types';
import './App.css';

function App() {
  const [teamText, setTeamText] = useState('');
  const [parsedTeam, setParsedTeam] = useState<PokemonWithSprite[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const teraListRef = useRef<HTMLDivElement>(null);

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
        let spriteDataUrl = '';
        let typeIconDataUrl: string | null = null;

        const spriteUrl = await fetchPokemonSprite(pokemon.name);
        if (spriteUrl) {
          try {
            spriteDataUrl = await loadImageAsDataUrl(spriteUrl);
          } catch {
            spriteDataUrl = '';
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
    setTeamText('');
    setParsedTeam([]);
    setShowResults(false);
  };

  const handleDownload = async (format: 'png' | 'jpg') => {
    if (!teraListRef.current) return;

    const canvas = await html2canvas(teraListRef.current, {
      backgroundColor: '#1a1a1a',
      scale: 2,
    });

    const link = document.createElement('a');
    link.download = `tera-list.${format}`;
    link.href = canvas.toDataURL(
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      0.95
    );
    link.click();
  };

  return (
    <div className="app">
      <Header />
      <main className="main">
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
            onDownload={handleDownload}
          />
        )}
      </main>
    </div>
  );
}

export default App;
