import React from "react";
import { useTheme } from "../context/ThemeContext";

interface FooterProps {
  theme?: "light" | "dark";
}

const GITHUB_URL = "https://github.com/danvalinotti";

export const Footer: React.FC<FooterProps> = () => {
  const { theme } = useTheme();

  const resolvedTheme =
    theme ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  return (
    <footer className={`footer ${resolvedTheme}`}>
      <span>
        © {new Date().getFullYear()} |{" "}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </span>
    </footer>
  );
};
