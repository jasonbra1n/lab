# Development Guide

Welcome to the development guide for the LAB Digital Workshop. This document serves as the primary technical overview for developers and AI assistants to understand the project's architecture, conventions, and contribution workflow.

**To get started on a task, review this guide first, then check `ROADMAP.md` for what to do next and `PROGRESS.md` for what has already been done.**

---

## Core Architecture

This project is a **Single Page Application (SPA)** built with vanilla HTML, CSS, and JavaScript. It uses a modular, dynamic loading system.

### Key Files

- **`index.html`**: The main application shell. It contains the header, footer, and navigation structure. The `<main id="console-container">` is where tools are dynamically loaded.
- **`script.js`**: The application's core engine. It is organized into three main objects:
  - `ThemeManager`: Handles switching between light and dark themes.
  - `ToolLoader`: Manages the dynamic fetching and injection of tool content (HTML, CSS, JS).
  - `App`: The main controller that initializes the application, handles routing, and manages event listeners.
- **`styles.css`**: Contains all global styles, theme variables (`:root`), and responsive media queries.

### The Tool Loading Lifecycle

The application uses URL hash-based routing to load tools.

1.  A user clicks a tool button (e.g., "Magic 8 Ball").
2.  The `App.handleNavClick` event handler updates the URL hash (`window.location.hash = 'magic-8-ball'`).
3.  This triggers a `hashchange` event on the window.
4.  The `App.handleInitialLoad` listener catches this event and calls `ToolLoader.loadTool('magic-8-ball')`.
5.  `ToolLoader.loadTool` performs the following steps:
    - Displays a loading message.
    - Fetches the tool's `index.html`, `styles.css`, and any external dependencies (defined in `ToolLoader.dependencies`).
    - Injects the tool's HTML and CSS into the main `tool-container`.
    - Loads the tool's `script.js`.
    - Dispatches a `toolLoaded` custom event to signal that the tool is ready.

---

## File Structure

The project follows a consistent structure.

```
/
├── index.html         # Main application shell
├── script.js          # Core application logic
├── styles.css         # Global stylesheets
├── docs/
│   ├── DEVELOPMENT_GUIDE.md  # (This file) Technical overview
│   ├── ROADMAP.md            # Future features and plans
│   └── PROGRESS.md           # Changelog of completed work
└── tools/
    └── {tool-name}/
        ├── index.html    # HTML content for the tool
        ├── script.js     # (Optional) JS logic for the tool
        └── styles.css    # (Optional) CSS specific to the tool
```

---

## How to Add a New Tool

1.  **Create Directory**: Add a new folder inside `/tools/` with a descriptive, kebab-case name (e.g., `my-new-tool`).
2.  **Create Files**: Inside the new folder, create `index.html`. Optionally, add `script.js` and `styles.css`.
    - The `index.html` should have a single root container element, like `<div class="container">...</div>`.
3.  **Add to Navigation**: In the main `index.html`, add a new `<button class="tool-btn" data-tool="my-new-tool">...</button>` to the appropriate pillar.
4.  **Add Dependencies (if any)**: If your tool requires external libraries (like Tone.js or JSZip), add them to the `dependencies` object in `ToolLoader` inside `script.js`.
5.  **Initialize Tool Script**: If your tool has a `script.js`, it should listen for the `toolLoaded` event to initialize itself. This ensures the DOM is ready.

    ```javascript
    // In /tools/my-new-tool/script.js
    document.addEventListener('toolLoaded', (e) => {
        if (e.detail.tool === 'my-new-tool') {
            // Your tool's initialization code here
        }
    });
    ```