import { useMemo } from 'react';
import { validateTeamInput } from '../utils/validateInput';
import styles from './TeamInput.module.css';

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

export function TeamInput({
  value,
  onChange,
  onGenerate,
  onClear,
  isLoading,
  error,
}: TeamInputProps) {
  const validation = useMemo(() => validateTeamInput(value), [value]);
  const errorId = error ? 'team-input-error' : undefined;
  const warningId = validation.warning ? 'team-input-warning' : undefined;

  return (
    <div className={styles.inputSection}>
      <label htmlFor='team-input' className={styles.visuallyHidden}>
        Pokemon team data
      </label>
      <textarea
        id='team-input'
        className={styles.teamInput}
        placeholder={PLACEHOLDER_TEXT}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label='Paste your Pokemon Showdown team or Pokepaste URL'
        aria-describedby={[errorId, warningId].filter(Boolean).join(' ') || undefined}
        aria-invalid={!!error}
      />
      {error && (
        <p id='team-input-error' className={styles.importError} role='alert'>
          {error}
        </p>
      )}
      {!error && validation.warning && (
        <p id='team-input-warning' className={styles.inputWarning}>
          {validation.warning}
        </p>
      )}
      <div className={styles.buttonGroup}>
        <button
          className={styles.generateBtn}
          onClick={onGenerate}
          disabled={!value.trim() || isLoading}
          aria-busy={isLoading}
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
