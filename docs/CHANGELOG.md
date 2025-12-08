# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project aims to follow its principles.

---

## [Unreleased]

---

## [1.0.0] - 2025-12-08 - Initial Public Release

### Added
- **Header/Navigation Redesign:** Implemented a fully responsive header with a hamburger menu for mobile devices. The navigation now transforms into a full-screen overlay on smaller viewports, controlled by JavaScript.
- **UI/UX:** Implemented a CSS-only loading animation to replace the "Loading tool..." text, improving visual feedback during tool transitions.
- **New "Links" Page:**
  - Added a new directly-injected tool, `tools/links/`, to provide a curated list of personal and professional links.
  - Integrated the page into the "Info" pillar of the main navigation.
  - Added custom styles in `styles.css` to ensure consistent theming and layout.
- **New "About" Page:** Created a new directly-injected tool, `about-page`, to provide information about the project's mission and architecture.

### Added
- **Hybrid Tool Architecture:** Formalized a new iframe-based loading method for tools via a `data-tool-iframe` attribute, allowing for standalone, isolated tool development and deployment.
- **New Tool (Play):** Added the "Denon CD Player" emulator, integrated via the iframe-embedding method.

### Changed
- **Decoupled Tools:** The following tools were refactored into their own repositories and are now loaded via iframe:
  - `radiostream-player`
  - `gematria-calculator`
  - `memory-game` (as "Memory Master")
  - `year-progress-calculator`
  - `subwoofer-enclosure-design`
  - `image-to-webp-converter`
  - `dj-audio-visualizer`

- **SPA Architecture:** Refactored the project into a Single Page Application with a modular `ToolLoader` and hash-based routing.
- **Code Organization:** Restructured `script.js` into logical objects (`App`, `ThemeManager`, `ToolLoader`) and implemented event delegation.
- **Developer Documentation:** Created the `/docs` directory with `ROADMAP.md`, `CHANGELOG.md`, and `DEVELOPMENT_GUIDE.md`.
- **UI/UX:** Improved mobile navigation and generalized tool styling.

### Changed
- Updated `README.md` to reflect the new SPA architecture and toolset.

---

## [0.1.0] - Pre-release: Initial Conception & SPA Refactor

### Added
- Initial set of tools and basic HTML structure.
- Refactored the project from a multi-page site into a Single Page Application.