import { ThemeToggle } from './ThemeToggle';
import { TeraIcon, GithubIcon } from '../icons';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.titleGroup}>
          <TeraIcon className={styles.teraIcon} />
          <h1>Pokemon Tera List</h1>
        </div>
        <div className={styles.headerButtons}>
          <a
            href='https://github.com/dvalinotti/pkmnteralist'
            target='_blank'
            rel='noopener noreferrer'
            className={styles.iconButton}
          >
            <GithubIcon className={styles.githubIcon} />
          </a>
          <ThemeToggle />
        </div>
      </div>
      <p className={styles.subtitle}>
        Paste your Pokemon Showdown team to generate a Tera type visual
      </p>
    </header>
  );
}
