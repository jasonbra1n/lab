# Project Progress & Changelog

This file tracks the major changes, features, and fixes implemented in the LAB Digital Workshop.

---

## [Phase 2] - SPA Refactor & Documentation

### Added
- **SPA Architecture:** Refactored the entire application into a Single Page Application (SPA) model.
  - Implemented a modular `ToolLoader` to dynamically load tool HTML, CSS, and JS.
  - Added URL hash-based routing (`/#tool-name`) for direct linking and browser history support.
- **Code Organization:**
  - Restructured `script.js` into logical objects (`App`, `ThemeManager`, `ToolLoader`).
  - Used event delegation for more efficient navigation handling.
- **Developer Documentation:**
  - Created `/docs` directory.
  - Added `ROADMAP.md` to outline future plans.
  - Added this `PROGRESS.md` file to serve as a changelog.
  - Added `DEVELOPMENT_GUIDE.md` to serve as a technical entry point for developers and AI.
- **UI/UX:**
  - Updated `styles.css` to use more generic, class-based styles for tools.
  - Improved mobile navigation menu behavior.

### Changed
- Updated `README.md` to accurately reflect the current toolset and new SPA architecture.

---

## [Phase 3] - Tool Decoupling & Architectural Evolution (In Progress)
*This section will track the move towards a more modular, hybrid architecture where tools can be either locally integrated or externally hosted.*

### Added
- **Hybrid Tool Architecture:** Formalized a new iframe-based loading method for tools.
  - `ToolLoader` now supports loading tools from an external URL into an `<iframe>` via a `data-tool-iframe` attribute on the navigation button.
  - This allows for standalone tools with their own repositories and deployment cycles, preventing CSS/JS conflicts.
- **Decoupled Radio Stream Player:** Refactored the `radiostream-player` to be the first standalone tool using the new iframe architecture.
  - The player now lives in its own repository and is loaded from its external URL.
### Added
- **New Tool (Play):** Added the "Denon CD Player" emulator.
  - This tool is integrated via the iframe-embedding method, loading from an external GitHub Pages URL.

---

## [Phase 4] - Content & UX Polish (In Progress)

### Added
- **New "About" Page:** Created a new directly-injected tool, `about-page`, to provide information about the project's mission and architecture.