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
    --background-color: #f4f4f9;
    --container-background: #ffffff;
    --text-color: #212529;
    --text-muted-color: #6c757d;
    --primary-color: #007bff;
    --primary-color-hover: #0056b3;
    --border-color: #dee2e6;
    --input-background: #ffffff;
    --input-border-color: #ced4da;
}

html.dark-theme {
    /* Dark Theme */
    --background-color: #121212;
    --container-background: #1e1e1e;
    --text-color: #e0e0e0;
    --text-muted-color: #888;
    --primary-color: #4dabf7;
    --primary-color-hover: #1e88e5;
    --border-color: #444;
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

## 2. Component Styling Examples

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
    color: #fff;
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

## 3. Theme Synchronization with Main App

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