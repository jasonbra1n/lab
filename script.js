/**
 * Manages the application's theme (light/dark).
 */
const ThemeManager = {
    init() {
        this.addThemeToggle();
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            document.documentElement.classList.add(savedTheme);
        } else if (prefersDark) {
            document.documentElement.classList.add('dark-theme');
        }
        this.updateThemeIcon();
        this.dispatchThemeEvent();
    },

    toggleTheme() {
        const htmlEl = document.documentElement;
        const isDark = htmlEl.classList.toggle('dark-theme');
        htmlEl.classList.toggle('light-theme', !isDark);
        localStorage.setItem('theme', isDark ? 'dark-theme' : 'light-theme');
        this.updateThemeIcon();
        this.dispatchThemeEvent();
    },

    updateThemeIcon() {
        const isDark = document.documentElement.classList.contains('dark-theme');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        if (sunIcon && moonIcon) {
            sunIcon.style.display = isDark ? 'none' : 'block';
            moonIcon.style.display = isDark ? 'block' : 'none';
        }
    },

    dispatchThemeEvent() {
        const isDark = document.documentElement.classList.contains('dark-theme');
        const event = new CustomEvent('themeChange', { detail: { isDark } });
        document.dispatchEvent(event);
    },

    addThemeToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'theme-toggle';
        toggle.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path id="sun-icon" d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                <path id="moon-icon" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" style="display:none"/>
            </svg>
        `;
        toggle.setAttribute('aria-label', 'Toggle dark mode');
        document.body.appendChild(toggle);
        toggle.addEventListener('click', () => this.toggleTheme());
        this.updateThemeIcon();
    }
};

/**
 * Manages loading and displaying tools.
 */
const ToolLoader = {
    toolContainer: null,
    currentTool: null,
    // Defines dependencies for specific tools
    dependencies: {
        'image-to-webp-converter': [
            'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'
        ],
        'binaural-beats': [
            'https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js'
        ]
    },

    init() {
        this.toolContainer = document.getElementById('tool-container');
    },

    async loadScript(src) {
        // Avoid reloading a script that's already present
        if (document.querySelector(`script[src="${src}"]`)) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    },

    async loadTool(toolName) {
        if (!toolName || this.currentTool === toolName) return;
        this.currentTool = toolName;

        // Special handling for the external Radio Stream Player
        if (toolName === 'radiostream-player') {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://jasonbra1n.github.io/Radio-Stream-Player/';
            iframe.title = 'Radio Stream Player';
            iframe.allow = 'autoplay; encrypted-media';
            iframe.className = 'tool-container'; // Let the iframe act as the tool container
            this.toolContainer.innerHTML = ''; // Clear previous content
            this.toolContainer.appendChild(iframe);

            console.log(`Loaded external tool in iframe: ${toolName}`);
            const event = new CustomEvent('toolLoaded', { detail: { tool: toolName } });
            document.dispatchEvent(event);
            return; // Exit the function to prevent trying to load local files
        }

        // The rest of the function handles locally stored tools
        try {
            this.toolContainer.innerHTML = '<div class="loading">Loading tool...</div>';

            // Fetch HTML and CSS concurrently
            const [htmlResponse, cssResponse] = await Promise.all([
                fetch(`tools/${toolName}/index.html`),
                fetch(`tools/${toolName}/styles.css`).catch(() => null) // Don't fail if CSS is missing
            ]);

            if (!htmlResponse.ok) throw new Error('Tool HTML not found');
            const html = await htmlResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const toolContent = doc.querySelector('.container') || doc.body.firstElementChild;

            if (!toolContent) throw new Error('Invalid tool format');

            const wrapper = document.createElement('div');
            wrapper.className = `tool-container ${toolName}-container`;

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'tool-content';
            contentWrapper.innerHTML = toolContent.innerHTML;

            wrapper.appendChild(contentWrapper);
            this.toolContainer.innerHTML = ''; // Clear loading message
            this.toolContainer.appendChild(wrapper);

            if (cssResponse && cssResponse.ok) {
                const cssText = await cssResponse.text();
                const styleElement = document.createElement('style');
                styleElement.textContent = cssText;
                this.toolContainer.appendChild(styleElement);
            } else {
                console.warn(`No styles.css found for ${toolName}, relying on main styles`);
            }

            // Load dependencies first, then the main tool script
            const deps = this.dependencies[toolName] || [];
            for (const dep of deps) {
                await this.loadScript(dep);
            }

            // Load the tool's own script
            await this.loadScript(`tools/${toolName}/script.js`);

            console.log(`Loaded tool: ${toolName}`);

            // Dispatch a custom event to signal that the tool's DOM is ready
            const event = new CustomEvent('toolLoaded', { detail: { tool: toolName } });
            document.dispatchEvent(event);

        } catch (error) {
            this.toolContainer.innerHTML = `
                <div class="error">
                    <h3>Error loading tool</h3>
                    <p>${error.message}</p>
                    <button id="home-btn-error">Return Home</button>
                </div>
            `;
            // Add listener to the new home button
            document.getElementById('home-btn-error').addEventListener('click', () => App.goHome());
        }
    }
};

/**
 * Main application controller.
 */
const App = {
    init() {
        this.copyrightYearEl = document.getElementById('copyright-year');
        this.toolNav = document.querySelector('.tool-nav');
        this.homeBtn = document.getElementById('home-btn');
        this.welcomeMessageHTML = document.getElementById('tool-container').innerHTML;

        ThemeManager.init();
        ToolLoader.init();
        this.setCopyrightYear();
        this.addEventListeners();
        this.handleInitialLoad();
    },

    setCopyrightYear() {
        if (this.copyrightYearEl) {
            this.copyrightYearEl.textContent = new Date().getFullYear();
        }
    },

    addEventListeners() {
        // Use event delegation for all nav clicks
        this.toolNav.addEventListener('click', this.handleNavClick.bind(this));

        // Handle clicks outside the pillar menus to close them
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.pillar')) {
                document.querySelectorAll('.tool-list.active').forEach(list => list.classList.remove('active'));
            }
        });

        // Handle header click to go home
        this.homeBtn.addEventListener('click', () => this.goHome());

        // Listen for URL hash changes (back/forward buttons)
        window.addEventListener('hashchange', this.handleInitialLoad.bind(this));
    },

    handleNavClick(e) {
        const pillarBtn = e.target.closest('.pillar-btn');
        const toolBtn = e.target.closest('.tool-btn');

        if (pillarBtn) {
            e.preventDefault();
            const toolList = pillarBtn.nextElementSibling;
            const isActive = toolList.classList.contains('active');
            // Close all other lists
            document.querySelectorAll('.tool-list').forEach(list => list.classList.remove('active'));
            // Toggle the current one
            if (!isActive) toolList.classList.add('active');
        }

        if (toolBtn) {
            const toolName = toolBtn.dataset.tool;
            window.location.hash = toolName; // This will trigger the 'hashchange' event and load the tool
        }
    },

    handleInitialLoad() {
        const toolName = window.location.hash.substring(1);
        if (toolName) {
            ToolLoader.loadTool(toolName);
            this.updateActiveButton(toolName);
            gtag('event', 'page_view', {
                page_title: toolName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                page_path: `/#${toolName}`
            });
        } else {
            this.goHome();
        }
    },

    goHome() {
        ToolLoader.toolContainer.innerHTML = this.welcomeMessageHTML;
        ToolLoader.currentTool = null;
        this.updateActiveButton(null);
        // Update URL to reflect home state without adding a new history entry
        history.pushState("", document.title, window.location.pathname + window.location.search);
    },

    updateActiveButton(toolName) {
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === toolName);
        });
        // Close any open pillar menus
        document.querySelectorAll('.tool-list.active').forEach(list => list.classList.remove('active'));
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
