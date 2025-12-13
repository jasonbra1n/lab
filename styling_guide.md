# LAB Digital Workshop - Styling Guide

This guide provides the core styling rules, variables, and best practices to ensure that all standalone tools (loaded via iframe) share a consistent visual identity with the main LAB Digital Workshop application.

---

## Core Principles

- **Consistent:** Tools should feel like they belong to the same family. Use the provided color palette and component styles.
- **Responsive:** All tools must be usable on a wide range of screen sizes, from mobile to desktop.
- **Accessible:** Use semantic HTML and ensure sufficient color contrast.

---

## 1. Base Styles & Theme Variables

To ensure your tool matches the LAB's theme, copy the following CSS variables into the top of your tool's main stylesheet. This block defines the color palette for both light and dark themes.

```css
/* 
   LAB Digital Workshop - Core Theme Variables
   Copy this block into your tool's main CSS file.
*/
:root {
    --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    
    /* Light Theme (Default) */
    --background-color: #f5f5f5; /* Matches main app console bg */
    --container-background: rgba(255, 255, 255, 0.75); /* Glass effect */
    --text-color: #212529;
    --text-muted-color: #6c757d;
    --primary-color: #2563eb;
    --primary-color-hover: #1d4ed8;
    --border-color: rgba(221, 221, 221, 0.5);
    --input-background: #ffffff;
    --input-border-color: #ced4da;
}

html.dark-theme {
    /* Dark Theme */
    --background-color: #1f2937; /* Matches main app console bg */
    --container-background: rgba(51, 65, 85, 0.6); /* Glass effect */
    --text-color: #e0e0e0;
    --text-muted-color: #888;
    --primary-color: #3b82f6;
    --primary-color-hover: #60a5fa;
    --border-color: rgba(55, 65, 81, 0.5);
    --input-background: #2c2c2c;
    --input-border-color: #555;
}

/* Apply base styles */
body {
    background-color: var(--background-color);
    color: var(--text-color);
    font-family: var(--font-family);
    margin: 0;
    padding: 1rem;
    box-sizing: border-box;
}
```

---

## 2. Glassmorphism Effect

The theme uses a "glassmorphism" (frosted glass) effect for containers. To apply this to your main tool container, use the following styles.

```css
.your-main-container {
    background-color: var(--container-background);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    /* This is the magic for the frosted glass effect */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); /* For Safari support */
}
```

---

## 3. Component Styling Examples

Use these classes as a baseline for common UI elements.

### Buttons

```css
.btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    border: 1px solid transparent;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border-radius: 0.25rem;
    color: white;
    background-color: var(--primary-color);
    transition: background-color 0.15s ease-in-out;
}

.btn:hover {
    background-color: var(--primary-color-hover);
}
```

### Inputs

```css
input[type="text"],
input[type="number"],
textarea {
    display: block;
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    color: var(--text-color);
    background-color: var(--input-background);
    border: 1px solid var(--input-border-color);
    border-radius: 0.25rem;
    box-sizing: border-box;
}
```

---

## 4. Theme Synchronization with Main App

For an iframed tool to automatically switch between light and dark themes when the main LAB app does, it needs to listen for messages from its parent window.

Add this JavaScript snippet to your tool's main script file. It listens for a `themeChange` event from the parent and applies the correct theme class to its own `<html>` element.

```javascript
window.addEventListener('message', (event) => {
    // Ensure the message is from a trusted origin if necessary
    // For example: if (event.origin !== 'https://lab.jasonbrain.com') return;

    if (event.data && event.data.type === 'themeChange') {
        // Use classList.toggle with a boolean to add/remove the class
        const isDark = event.data.theme === 'dark-theme';
        document.documentElement.classList.toggle('dark-theme', isDark);
    }
});

// Optional: Request the current theme from the parent on load
window.parent.postMessage({ type: 'requestTheme' }, '*');
```

You will also need to ensure the main `script.js` in the LAB project can handle these messages. See the `DEVELOPMENT_GUIDE.md` for more details on implementation.