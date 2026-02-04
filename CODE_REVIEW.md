# Code Review: Pokemon Tera List

**Reviewer:** Senior UI Software Engineer
**Date:** 2026-02-01
**Branch:** code-review

---

## Executive Summary

Overall, this is a well-structured React application with good separation of concerns, proper TypeScript usage, and a clean component architecture. The codebase follows modern React patterns and has good CSS organization using CSS Modules. Below are detailed findings organized by category and priority.

---

## Critical Issues

### 1. Duplicate `formatStatSpread` Function (DRY Violation)
**Files:** `TeraCard.tsx:13-44`, `TeraRow.tsx:13-30`

The same function is duplicated in both components. This violates the DRY principle and creates maintenance burden.

**Recommendation:** Extract to a shared utility file:
```typescript
// src/utils/formatStats.ts
export const formatStatSpread = (stats: StatSpread, isEV: boolean): string => { ... }
```

### 2. Using Array Index as React Key
**Files:** `TeraList.tsx:128-133`, `TeraCard.tsx:118-119`, `TeraRow.tsx:69-70`

Using array index as key can cause issues with React's reconciliation when items are reordered or filtered.

```tsx
// Current
{team.map((pokemon, index) => <TeraRow key={index} ... />)}

// Recommended - use pokemon name (assuming unique per team)
{team.map((pokemon) => <TeraRow key={pokemon.name} ... />)}
```

---

## High Priority Issues

### 3. Missing Error Boundary
**File:** `App.tsx`

The app has no error boundary to gracefully handle runtime errors. If a component throws, the entire app crashes.

**Recommendation:** Add an error boundary component:
```tsx
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component { ... }
```

### 4. Missing Loading States for Individual Sprites
**File:** `App.tsx:57-97`

All sprites are fetched in parallel with `Promise.all`, but there's no indication of which sprites failed. Failed sprites silently show a placeholder.

**Recommendation:** Consider adding visual feedback for failed sprite loads or retry logic.

### 5. Accessibility Issues

#### 5a. Missing ARIA Labels
**Files:** `TeraList.tsx`, `TeamInput.tsx`

- Checkboxes lack proper `aria-label` attributes
- The "Copy to Clipboard" button state changes aren't announced to screen readers

```tsx
// Current
<input type="checkbox" checked={showOTS} onChange={onOTSToggle} />

// Recommended
<input
  type="checkbox"
  id="ots-toggle"
  checked={showOTS}
  onChange={onOTSToggle}
  aria-describedby="ots-description"
/>
<label htmlFor="ots-toggle">Display full OTS</label>
```

#### 5b. Missing `aria-live` for Dynamic Content
**File:** `TeraList.tsx:105-116`

The copy button status changes should be announced:
```tsx
<button aria-live="polite" aria-label={copyStatus === "idle" ? "Copy to clipboard" : copyStatus}>
```

### 6. No Request Cancellation/Cleanup
**File:** `App.tsx:30-101`

The `handleGenerate` function doesn't handle component unmount during async operations. This can cause memory leaks and "setState on unmounted component" warnings.

**Recommendation:** Use `AbortController` or track mounted state:
```tsx
useEffect(() => {
  const controller = new AbortController();
  return () => controller.abort();
}, []);
```

---

## Medium Priority Issues

### 7. Inconsistent Quotation Style
**Files:** Multiple

Mix of single and double quotes across files. The codebase should be consistent.

**Recommendation:** Configure ESLint/Prettier to enforce consistent quotes.

### 8. SVG Icons Should Be Extracted
**Files:** `TeraList.tsx:9-28`, `Header.tsx:4-17`

Inline SVG icons clutter the component files.

**Recommendation:** Create an `icons/` directory:
```
src/
  icons/
    ClipboardIcon.tsx
    CheckIcon.tsx
    DownloadIcon.tsx
    TeraIcon.tsx
```

### 9. Magic Numbers/Strings
**File:** `App.tsx:130`, `TeraList.tsx:65,68`

```tsx
// Magic numbers
backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff";
setTimeout(() => setCopyStatus("idle"), 2000);
```

**Recommendation:** Extract to constants:
```tsx
const COPY_FEEDBACK_DURATION_MS = 2000;
const THEME_BACKGROUNDS = { dark: "#1a1a1a", light: "#ffffff" };
```

### 10. Type Safety Improvements

#### 10a. Loose Type for `TERA_TYPE_COLORS`
**File:** `types.ts:37`

```tsx
// Current - allows any string key
export const TERA_TYPE_COLORS: Record<string, string> = { ... }

// Recommended - strict typing
export const TERA_TYPE_COLORS: Record<TeraType, string> = { ... }
```

#### 10b. Pokemon Name Should Use Template Literal Type
**File:** `types.ts`

Consider using branded types for Pokemon names to prevent passing arbitrary strings.

### 11. Missing Form Validation
**File:** `TeamInput.tsx`

No validation on the textarea content before submission. While the parser handles invalid input gracefully, user-friendly validation messages would improve UX.

### 12. Potential Memory Leak in Image Loading
**File:** `imageUtils.ts:3-22`

The `loadImageAsDataUrl` function creates Image objects but doesn't clean up event listeners if the promise is rejected.

```tsx
// Should clean up on rejection
img.onerror = () => {
  img.onload = null;
  img.onerror = null;
  reject(new Error(`Failed to load image: ${url}`));
};
```

---

## Low Priority Issues

### 13. Console.error in Production
**Files:** `App.tsx:161,173`

Console errors should be conditionally logged or sent to an error tracking service in production.

### 14. Missing `rel="noopener"` on External Links
**File:** `Header.tsx`

The GitHub link has `rel="noopener noreferrer"` which is good, but verify all external links have this.

### 15. CSS Improvements

#### 15a. Unused CSS Classes
Audit CSS modules for potentially unused classes after refactoring.

#### 15b. CSS Custom Properties Could Be More Semantic
**File:** `index.css`

```css
/* Current */
--bg-primary: #121212;

/* More semantic */
--color-surface-primary: #121212;
--color-text-primary: rgba(255, 255, 255, 0.87);
```

### 16. Missing `package.json` Scripts
Consider adding:
- `lint` - ESLint check
- `lint:fix` - ESLint auto-fix
- `type-check` - TypeScript without emit
- `test` - Unit tests (currently no tests)

### 17. No Unit Tests
The application has no test coverage. Priority areas for testing:
- `parseTeam.ts` - Pure function, easy to test
- `pokepaste.ts` - URL parsing logic
- `imageUtils.ts` - Normalization functions

---

## Positive Observations

1. **Good Component Structure:** Clean separation between container (App) and presentational components
2. **CSS Modules:** Proper scoping prevents style leaks
3. **TypeScript:** Good type coverage throughout
4. **Theme System:** Well-implemented dark/light mode with CSS variables
5. **Graceful Degradation:** Safari clipboard fallback is well-handled
6. **Barrel Exports:** `components/index.ts` provides clean imports
7. **Responsive Design:** Mobile-first approach with appropriate breakpoints
8. **Performance:** Images converted to base64 for clipboard/download functionality

---

## Recommended Action Items (Priority Order)

1. [ ] Extract `formatStatSpread` to shared utility
2. [ ] Add error boundary component
3. [ ] Fix React key usage (use pokemon.name instead of index)
4. [ ] Add accessibility improvements (ARIA labels, live regions)
5. [ ] Extract inline SVG icons to separate files
6. [ ] Add request cancellation for async operations
7. [ ] Extract magic numbers to constants
8. [ ] Add unit tests for utility functions
9. [ ] Strengthen TypeScript types
10. [ ] Add ESLint/Prettier configuration for consistency

---

## Files Changed in This Review

This review is documentation only. No code changes have been made on this branch.
