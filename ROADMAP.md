# Project Roadmap

This document outlines the development roadmap for the LAB Digital Workshop. It's a living document that will evolve as the project grows.

---

## Current Focus (Q4 2025 / Q1 2026) - Main Application
- **UI/UX & Tool Refinement:**
  - [ ] **Iframe Tools Microphone Access:**
    - [ ] Investigate and implement a workaround for microphone access issues in iframe tools (e.g., Cymascope, Audio Visualizer).
    - **Plan:**
      - [ ] Add `microphone` to the `allow` attribute of relevant iframes in `ToolLoader.js`.
      - [ ] Create a centralized function in the main `App` or a new `PermissionsManager` to request `getUserMedia` access when a mic-requiring tool is loaded.
      - [ ] Implement a `postMessage` communication channel where the iframe can request the parent to initiate the microphone permission prompt.
      - [ ] Test in various browsers (Brave, Chrome, Firefox) to confirm the solution is robust.

  - [ ] **Iframe Tools Theme Switching Audit:**
    - [ ] Audit all iframe tools to ensure proper theme switching.
    - **Plan:**
      - [ ] Create a markdown checklist of all tools loaded via iframe (from `index.html`).
      - [ ] For each tool, manually test theme switching by toggling the theme in the main app.
      - [ ] Document any tools that fail to switch themes correctly.
      - [ ] Update the `styling_guide.md` and the failing tool's code to correctly implement the `message` event listener for theme changes.

  - [ ] **Responsiveness & Accessibility Audit (Local Tools):**
    - [ ] `about-page` (Local)
    - [ ] `binaural-beats` (Local)
    - [ ] `days-between-dates` (Local)
    - [ ] `life-path-calculator` (Local)
    - [ ] `links` (Local)
    - [ ] `math-calculator` (Local)
      
  - [ ] **Local Tool Headers & Info Sections:**
    - [ ] Add a consistent header to each local tool (excluding "Info" pillar tools) with its title and an "About" button.
    - **Plan:**
      - [ ] Modify `ToolLoader.js` in `loadLocalTool` to dynamically prepend a header element to the tool's content.
      - [ ] The header will contain the tool's title (derived from the button text) and an "About this tool" button.
      - [ ] Clicking the "About" button will reveal/scroll to a new section within the tool's HTML, containing a brief description of its purpose and usage.

> **Note:** Audits for standalone (iframed) tools are managed within their individual repositories. See the `README.md` for a list of tools and their sources.

## Next Up

- **New Tools:**
  - [ ] **Retreat 🌿:** A guided breathing exercise tool.
  - [ ] **Work 🔧:** A JSON formatter/validator.
  - [ ] **Play 🎮:** A simple typing speed test game.

## Future Ideas (Backlog)

- **User Accounts:** Allow users to save settings or data for specific tools (e.g., favorite radio stations).
- **Internationalization (i18n):** Add support for multiple languages.
- **PWA Conversion:** Make the SPA a fully installable Progressive Web App for offline access.
- **API Integration:** Create a tool that fetches and displays data from a public API (e.g., weather, stock prices).

---
- **Documentation Overhaul:** Completed documentation overhaul for project management (Package 1.0.1).

## Recently Completed

- **UI/UX:** Improved the date picker and overall UI/UX for the Life Path Calculator.
- **UI/UX:** Redesigned the header with a responsive hamburger menu for mobile.
- **UI/UX:** Implemented a CSS-only loading animation for tool transitions.
- **Architecture:** Decoupled the `dj-audio-visualizer` into its own repository and integrated it via iframe.
- **New Page:** Added the "About This Project" page.
- **Architecture:** Decoupled the `year-progress-calculator` into its own repository and integrated it via iframe.
- **New Page:** Added the "Links" page with custom styling.
- **Architecture:** Decoupled the `memory-game` into its own repository ("Memory Master") and integrated it via iframe.
- **Architecture:** Decoupled the `gematria-calculator` into its own repository and integrated it via iframe.
- **Architecture:** Decoupled the `radiostream-player` into its own repository and integrated it via iframe.
- **New Tool:** Added the "Denon CD Player" emulator via iframe.
- **UI/UX:** Improved the mobile navigation menu's behavior.
- **New Tool:** Added the "Cymascope" sound visualizer via iframe.