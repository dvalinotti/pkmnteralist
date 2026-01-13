import styles from "./TeamInput.module.css";

interface TeamInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
  error?: string | null;
}

const PLACEHOLDER_TEXT = `Paste your Pokemon Showdown team or a Pokepaste URL...

Examples:
  https://pokepast.es/abc123

  Pikachu @ Light Ball
  Ability: Static
  Tera Type: Electric
  EVs: 252 SpA / 4 SpD / 252 Spe
  Timid Nature
  - Thunderbolt
  - Surf
  - Grass Knot
  - Volt Switch`;

export function TeamInput({ value, onChange, onGenerate, onClear, isLoading, error }: TeamInputProps) {
  return (
    <div className={styles.inputSection}>
      <textarea
        className={styles.teamInput}
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className={styles.importError}>{error}</p>}
      <div className={styles.buttonGroup}>
        <button
          className={styles.generateBtn}
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? 'Loading...' : 'Generate Tera List'}
        </button>
        <button className={styles.clearBtn} onClick={onClear}>
          Clear
        </button>
      </div>
    </div>
  );
}
