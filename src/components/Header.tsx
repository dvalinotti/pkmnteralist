import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Pokemon Tera List</h1>
        <p className="subtitle">
          Paste your Pokemon Showdown team to generate a Tera type visual
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
}
