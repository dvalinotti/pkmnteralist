import styles from './ViewToggle.module.css';

export type ViewMode = 'list' | 'grid';

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: () => void;
}

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <button
      className={styles.viewToggle}
      onClick={onToggle}
      aria-label={`Switch to ${viewMode === 'list' ? 'grid' : 'list'} view`}
    >
      {viewMode === 'list' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect x='3' y='3' width='7' height='7' />
          <rect x='14' y='3' width='7' height='7' />
          <rect x='3' y='14' width='7' height='7' />
          <rect x='14' y='14' width='7' height='7' />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='18'
          height='18'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <line x1='3' y1='6' x2='21' y2='6' />
          <line x1='3' y1='12' x2='21' y2='12' />
          <line x1='3' y1='18' x2='21' y2='18' />
        </svg>
      )}
      <span>{viewMode === 'list' ? 'Grid' : 'List'}</span>
    </button>
  );
}
