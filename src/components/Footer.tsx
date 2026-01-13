import React from "react";
import styles from "./Footer.module.css";

const GITHUB_URL = "https://github.com/danvalinotti";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span>
        © {new Date().getFullYear()} |{" Dan Valinotti "}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </span>
    </footer>
  );
};
