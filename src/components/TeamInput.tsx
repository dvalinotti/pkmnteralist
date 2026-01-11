interface TeamInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

const PLACEHOLDER_TEXT = `Paste your Pokemon Showdown team here...

Example:
Pikachu @ Light Ball
Ability: Static
Tera Type: Electric
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Surf
- Grass Knot
- Volt Switch`;

export function TeamInput({ value, onChange, onGenerate, onClear, isLoading }: TeamInputProps) {
  return (
    <div className="input-section">
      <textarea
        className="team-input"
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="button-group">
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? 'Loading...' : 'Generate Tera List'}
        </button>
        <button className="clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
