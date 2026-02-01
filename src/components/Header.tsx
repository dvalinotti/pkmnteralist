import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <h1>Pokemon Tera List</h1>
        <div className={styles.headerButtons}>
          <a
            href="https://github.com/dvalinotti/pkmnteralist"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={styles.githubIcon}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0C5.373 0 0 5.373 0 12c0 5.25 3.438 9.688 8.207 11.188.6.111.793-.261.793-.577 0-.287-.011-1.045-.016-2.052-3.338.724-4.042-1.607-4.042-1.607-.546-1.384-1.333-1.754-1.333-1.754-1.089-.743.083-.728.083-.728 1.204.085 1.838 1.237 1.838 1.237 1.067 1.826 2.8 1.297 3.482.992.108-.773.418-1.297.762-1.597-2.665-.303-5.467-1.333-5.467-5.933 0-1.313.469-2.386 1.236-3.22-.124-.303-.536-1.53.117-3.185 0 0 1.008-.322 3.301 1.23a11.53 11.53 0 0 1 3.003-.404c1.018 0 2.042.137 3.003.404 2.293-1.552 3.301-1.23 3.301-1.23.653 1.655.241 2.882.118 3.185.767.834 1.236 1.907 1.236 3.22 0 4.607-2.805 5.63-5.475 5.925.43.371.815 1.102.815 2.222 0 1.606-.014 2.903-.014 3.295 0 .319.192.693.798.577C20.563 21.688 24 17.25 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
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
