# LAB: Digital Workshop

Welcome to **LAB: Digital Workshop**, an open-source single-page application (SPA) by [Jason Brain](https://jasonbrain.com). This project is a creative sandbox featuring a growing collection of interactive tools designed to help you work, learn, rest, and play—all in one place. Hosted at [lab.jasonbrain.com](https://lab.jasonbrain.com), it’s built with HTML, CSS, and JavaScript, and styled with a light/dark theme toggle for accessibility.

## Architecture

The application uses a **dual-loading system** to integrate tools:

- **Local Tools (Direct Injection):** Simple, lightweight tools stored in the `/tools` directory are fetched and injected directly into the DOM. This provides a fast, seamless experience for tightly integrated utilities.
- **Standalone Tools (Iframe Embedding):** More complex or externally-hosted tools are embedded within an `<iframe>`. This sandboxes the tool, preventing CSS or JS conflicts and allowing for independent development and deployment.

This hybrid approach allows the workshop to be both highly extensible and maintainable.

## Features

- **Modular Toolset:** Tools are organized into five pillars:
  - **Factory (Work 🔧):** Productivity-focused utilities.
  - **Classroom (Learn 📚):** Educational and insightful calculators.
  - **Retreat (Rest 🌿):** Tools for relaxation and mindfulness.
  - **Arcade (Play 🎮):** Fun, interactive experiences.
  - **Info (Info 🧠):** Project information and external links.
- **Responsive Design:** Works seamlessly on desktop and mobile.
- **Theme Support:** Switch between light and dark modes with a single click.
- **SPA Architecture:** Dynamically loads tools without page reloads, using URL hash-based routing.
- **Analytics:** Tracks usage via Google Analytics and AdSense integration.

## Current Tools

### Factory: Work Tools 🔧
- **Image to WebP Converter** (Iframe): Convert images to WebP format with drag-and-drop support and ZIP download.
- **Math Calculator** (Local): Perform basic arithmetic operations with history and clipboard support.
- **Audio Visualizer** (Iframe): Create audio visualizations.
- **Subwoofer Enclosure Design** (Iframe): Calculate subwoofer box designs.

### Classroom: Learn Tools 📚
- **Life Path Calculator** (Local): Compute your numerology-based life path number and personality traits.
- **Gematria Calculator** (Iframe): Calculate gematria values for words using multiple systems.
- **Astronomy** (Iframe): View the current phase of the moon and other astronomical data.
- **Days Between Dates** (Local): Calculate the number of days between two dates.
- **Year Progress** (Iframe): Visualize your year’s progress with a dynamic chart.

### Retreat: Rest Tools 🌿
- **Binaural Beats** (Local): Generate binaural beats for focus or relaxation.
- **Cymascope** (Iframe): Visualize sound vibrations and create intricate cymatic patterns.

### Arcade: Play Tools 🎮
- **Radio Stream Player** (Iframe): Stream your favorite radio stations.
- **Magic 8 Ball** (Iframe): Get answers to your questions from the digital oracle.
- **Memory Master** (Iframe): A classic card-matching memory game.
- **Denon CD Player** (Iframe): An emulator for the classic Denon DN-1000F CD player.

### Info: Info 🧠
- **About This Project** (Local): Learn about the project's mission, architecture, and development process.
- **Links** (Local): A curated list of relevant personal and professional links.

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, etc.).
- Optional: Git and a local server (e.g., `live-server`) for development.

### Installation
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/jasonbra1n/lab.jasonbrain.com.git
   cd lab.jasonbrain.com
   ```
2. **Open Locally:**
   - Open `index.html` in a browser, or
   - Use a local server: `npx live-server` (requires Node.js).
3. **Explore:**
   - Click the pillar buttons (Work 🔧, Learn 📚, Rest 🌿, Play 🎮) to reveal tools.
   - Select a tool to load it dynamically into the console area.

### Deployment
- Hosted via GitHub Pages at `lab.jasonbrain.com`. To deploy your own:
  1. Push to your GitHub repository.
  2. Enable GitHub Pages in Settings > Pages, selecting the `main` branch and `/` (root).

## Contributing
Contributions are welcome! This project is designed to be open and AI-friendly.

If you'd like to add a new tool, fix a bug, or enhance the UI, please read our **Contributing Guide** to get started. It contains everything you need to know about the development workflow, where to find tasks, and how to submit your changes.

## License

This project is open-source under the [MIT License](LICENSE). Feel free to use, modify, and share!

## Contact

Created by Jason Brain. Reach out via [jasonbrain.com](https://jasonbrain.com) or open an issue here on GitHub.
