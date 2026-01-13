/**
 * Extracts the paste ID from a Pokepaste URL.
 * Supports formats like:
 * - https://pokepast.es/abc123
 * - https://pokepast.es/abc123/raw
 * - pokepast.es/abc123
 */
export const extractPasteId = (input: string): string | null => {
  // Clean up the input
  const trimmed = input.trim();

  // Check if it looks like a pokepaste URL
  const urlPattern = /(?:https?:\/\/)?pokepast\.es\/([a-zA-Z0-9]+)(?:\/raw)?/;
  const match = trimmed.match(urlPattern);

  if (match) {
    return match[1];
  }

  return null;
};

/**
 * Checks if a string looks like a Pokepaste URL.
 */
export const isPokepastUrl = (input: string): boolean => {
  return extractPasteId(input) !== null;
};

/**
 * Fetches the raw content from a Pokepaste URL.
 * Returns the team text or throws an error.
 */
export const fetchPokepaste = async (input: string): Promise<string> => {
  const pasteId = extractPasteId(input);

  if (!pasteId) {
    throw new Error("Invalid Pokepaste URL");
  }

  const rawUrl = `https://pokepast.es/${pasteId}/raw`;

  try {
    const response = await fetch(rawUrl);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Paste not found. Check the URL and try again.");
      }
      throw new Error(`Failed to fetch paste: ${response.status}`);
    }

    const text = await response.text();

    if (!text.trim()) {
      throw new Error("Paste is empty");
    }

    return text;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      // CORS or network error
      throw new Error(
        "Unable to fetch paste. This may be due to browser restrictions. " +
        "Try copying the team text directly from Pokepaste instead."
      );
    }
    throw error;
  }
};
