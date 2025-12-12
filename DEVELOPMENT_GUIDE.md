# Development Guide

Welcome to the development guide for the LAB Digital Workshop. This document serves as the primary technical overview for developers and AI assistants to understand the project's architecture, conventions, and contribution workflow.

**To get started on a task, review this guide first, then check `ROADMAP.md` for what to do next and `CHANGELOG.md` for what has already been done.**

---

## Core Architecture

This project is a **Single Page Application (SPA)** built with vanilla HTML, CSS, and JavaScript. It uses a modular, dynamic loading system.

### Key Files

- **`index.html`**: The main application shell. It contains the header, footer, and navigation structure. The `<main id="console-container">` is where tools are dynamically loaded.
- **`index.html`**: The main application shell. It contains the header, footer, and navigation structure. The `<div id="tool-container">` (inside `<main>`) is where tools are dynamically loaded.
- **`script.js`**: The application's core engine. It is organized into three main objects:
  - `ThemeManager`: Handles switching between light and dark themes.
  - `ToolLoader`: Manages the dynamic fetching and injection of tool content (HTML, CSS, JS).
  - `App`: The main controller that initializes the application, handles routing, and manages event listeners.
- **`styles.css`**: Contains all global styles, theme variables (`:root`), and responsive media queries.

### The Tool Loading Lifecycle

---

The application supports two methods for loading tools, determined by the `data-` attributes on the tool's navigation button in `index.html`.

#### Method 1: Direct Injection (Default)
This is the standard method for simple, tightly integrated tools.

1.  A user clicks a tool button with a `data-tool="{tool-name}"` attribute.
2.  The `App.handleNavClick` event handler updates the URL hash (`window.location.hash = 'tool-name'`).
3.  The `hashchange` event triggers `ToolLoader.loadTool('tool-name')`.
4.  `ToolLoader.loadTool` fetches the tool's local files (`/tools/{tool-name}/...`).
5.  It injects the tool's HTML and CSS into the DOM and executes its script.
6.  A `toolLoaded` custom event is dispatched to initialize the tool's script.

#### Method 2: Iframe Embedding
This method is ideal for complex tools, tools hosted externally, or those that require strong isolation from the main application.

1.  A user clicks a tool button with a `data-tool-iframe="{url}"` attribute.
2.  The `App.handleNavClick` event handler uses the `data-tool` value to update the URL hash (`window.location.hash = 'tool-name'`).
3.  The `hashchange` event triggers `ToolLoader.loadTool('tool-name')`.
4.  `ToolLoader.loadTool` finds the button using the `tool-name`.
5.  It then reads the `data-tool-iframe` attribute from that button and creates an `<iframe>`.
6.  The `iframe.src` is set to the provided URL.
7.  The iframe is appended to the `<main id="console-container">`, completely isolating the tool's environment.
7.  The iframe is appended to the `<div id="tool-container">`, completely isolating the tool's environment.
8.  Once the iframe loads, `ThemeManager` sends a `postMessage` to the iframe to sync the current theme (light/dark).

**Benefits of Iframe Embedding:**
- **Isolation:** CSS and JavaScript are sandboxed, preventing conflicts.
- **Independent Deployment:** The tool can be developed and deployed from its own repository.
- **Flexibility:** Allows integration of tools built with different technologies (e.g., React, Vue) without modifying the core SPA.

---

## File Structure

The project follows a consistent structure.

```
/
├── index.html         # Main application shell
├── script.js          # Core application logic
├── styles.css         # Global stylesheets
├── CONTRIBUTING.md    # Contribution guidelines
├── DEVELOPMENT_GUIDE.md  # (This file) Technical overview
├── ROADMAP.md            # Future features and plans
├── CHANGELOG.md          # Log of all notable changes
├── styling_guide.md      # CSS and theme guide for iframed tools
└── tools/
    └── {tool-name}/
        ├── index.html    # HTML content for the tool
        ├── script.js     # (Optional) JS logic for the tool
        └── styles.css    # (Optional) CSS specific to the tool
```

---

## How to Add a New Tool

There are two ways to add a new tool, corresponding to the two loading methods. Choose the one that best fits your tool's complexity and architecture.

### Method 1: Adding a Directly Injected Tool

This is for simple tools integrated directly into the main repository.

1.  **Create Directory**: Add a new folder inside `/tools/` with a descriptive, kebab-case name (e.g., `my-new-tool`).
2.  **Create Files**: Inside the new folder, create `index.html`. Optionally, add `script.js` and `styles.css`.
    - The `index.html` should have a single root container element, like `<div class="container">...</div>`.
3.  **Add to Navigation**: In the main `index.html`, add a new `<button>` to the appropriate pillar. Use the `data-tool` attribute with your tool's folder name.
    ```html
    <button class="tool-btn" data-tool="my-new-tool">My New Tool</button>
    <!-- The value of data-tool must exactly match the folder name inside /tools/ -->
    ```
4.  **Add Dependencies (if any)**: If your tool requires external libraries (like Tone.js or JSZip), add them to the `dependencies` object in `ToolLoader` inside `script.js`.
5.  **Initialize Tool Script**: If your tool has a `script.js`, it must listen for the `toolLoaded` event to initialize itself. This ensures the DOM is ready.

    ```javascript
    // In /tools/my-new-tool/script.js
    document.addEventListener('toolLoaded', (e) => {
        if (e.detail.tool === 'my-new-tool') {
            // Your tool's initialization code here
        }
    });
    ```

### Method 2: Adding a Standalone (Iframe) Tool

This is for complex tools, or tools that live in their own repository (like the Radio Stream Player).

1.  **Deploy Your Tool**: Ensure your tool is deployed and accessible via a URL.
2.  **Add to Navigation**: In the main `index.html`, add a new `<button>` to the appropriate pillar. Use the `data-tool-iframe` attribute with the full URL to your tool.
    - **Important**: Also include a `data-tool` attribute with a unique name. This is used for URL hashing and routing.
    ```html
    <button class="tool-btn" data-tool="my-iframe-tool" data-tool-iframe="https://my-tool.example.com">My Iframe Tool</button>
    ```

3.  **Implement Theme Syncing (Recommended)**: To ensure your tool's theme stays in sync with the main application, add a `message` event listener to your tool's JavaScript. This is detailed in the `styling_guide.md`.

That's it! The `ToolLoader` will handle creating the iframe and loading your tool when the button is clicked.