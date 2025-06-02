// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.classList.add(savedTheme);
    } else if (prefersDark) {
        document.documentElement.classList.add('dark-theme');
    }
    updateThemeIcon();
    dispatchThemeEvent();
}

function toggleTheme() {
    const htmlEl = document.documentElement;
    
    if (htmlEl.classList.contains('dark-theme')) {
        htmlEl.classList.remove('dark-theme');
        htmlEl.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme');
    } else {
        htmlEl.classList.remove('light-theme');
        htmlEl.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    }
    updateThemeIcon();
    dispatchThemeEvent();
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    
    if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'none' : 'block';
        moonIcon.style.display = isDark ? 'block' : 'none';
    }
}

function dispatchThemeEvent() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const event = new CustomEvent('themeChange', { detail: { isDark } });
    document.dispatchEvent(event);
}

function addThemeToggle() {
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
    toggle.addEventListener('click', toggleTheme);
    updateThemeIcon();
}

// Tool Loading System
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    addThemeToggle();
    
    const toolButtons = document.querySelectorAll('.tool-btn');
    const pillarButtons = document.querySelectorAll('.pillar-btn');
    const toolContainer = document.getElementById('tool-container');
    
    // Tool button clicks
    toolButtons.forEach(button => {
        button.addEventListener('click', function() {
            toolButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const toolName = this.dataset.tool;
            loadTool(toolName);
            document.querySelectorAll('.tool-list').forEach(list => {
                list.classList.remove('active');
            });
            gtag('event', 'page_view', {
                page_title: toolName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                page_path: `/tools/${toolName}`
            });
            // Dispatch toolChange event
            const event = new CustomEvent('toolChange', { detail: { tool: toolName } });
            document.dispatchEvent(event);
        });
    });
    
    // Pillar button clicks for touch devices
    pillarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const toolList = this.nextElementSibling;
            const isActive = toolList.classList.contains('active');
            
            document.querySelectorAll('.tool-list').forEach(list => {
                list.classList.remove('active');
            });
            
            if (!isActive) {
                toolList.classList.add('active');
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.pillar')) {
            document.querySelectorAll('.tool-list').forEach(list => {
                list.classList.remove('active');
            });
        }
    });
    
    async function loadTool(toolName) {
        try {
            toolContainer.innerHTML = '<div class="loading">Loading tool...</div>';
            
            const htmlResponse = await fetch(`tools/${toolName}/index.html`);
            if (!htmlResponse.ok) throw new Error('Tool HTML not found');
            const html = await htmlResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const toolContent = doc.querySelector('.container') || doc.querySelector('body > div');
            
            if (!toolContent) throw new Error('Invalid tool format');
            
            const wrapper = document.createElement('div');
            wrapper.className = `tool-container ${toolName}-container`;
            
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'tool-content';
            contentWrapper.innerHTML = toolContent.innerHTML;
            
            wrapper.appendChild(contentWrapper);
            toolContainer.innerHTML = '';
            toolContainer.appendChild(wrapper);
            
            const cssResponse = await fetch(`tools/${toolName}/styles.css`);
            if (cssResponse.ok) {
                const cssText = await cssResponse.text();
                const styleElement = document.createElement('style');
                styleElement.textContent = cssText;
                toolContainer.appendChild(styleElement);
            } else {
                console.warn(`No styles.css found for ${toolName}, relying on main styles`);
            }
            
            if (toolName === 'image-to-webp-converter') {
                if (!window.JSZip) {
                    const jszipScript = document.createElement('script');
                    jszipScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
                    toolContainer.appendChild(jszipScript);
                    
                    jszipScript.onload = () => {
                        if (!window.saveAs) {
                            const fileSaverScript = document.createElement('script');
                            fileSaverScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
                            fileSaverScript.onload = () => {
                                const script = document.createElement('script');
                                script.src = `tools/${toolName}/script.js`;
                                toolContainer.appendChild(script);
                            };
                            toolContainer.appendChild(fileSaverScript);
                        } else {
                            const script = document.createElement('script');
                            script.src = `tools/${toolName}/script.js`;
                            toolContainer.appendChild(script);
                        }
                    };
                } else if (!window.saveAs) {
                    const fileSaverScript = document.createElement('script');
                    fileSaverScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js';
                    fileSaverScript.onload = () => {
                        const script = document.createElement('script');
                        script.src = `tools/${toolName}/script.js`;
                        toolContainer.appendChild(script);
                    };
                    toolContainer.appendChild(fileSaverScript);
                } else {
                    const script = document.createElement('script');
                    script.src = `tools/${toolName}/script.js`;
                    toolContainer.appendChild(script);
                }
            } else if (toolName === 'binaural-beats' && !window.Tone) {
                const toneScript = document.createElement('script');
                toneScript.src = 'https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js';
                toneScript.onload = () => {
                    const script = document.createElement('script');
                    script.src = `tools/${toolName}/script.js`;
                    toolContainer.appendChild(script);
                };
                toolContainer.appendChild(toneScript);
            } else {
                const script = document.createElement('script');
                script.src = `tools/${toolName}/script.js`;
                script.onload = () => console.log(`Script loaded for ${toolName}`);
                script.onerror = () => console.error(`Failed to load script for ${toolName}`);
                toolContainer.appendChild(script);
            }
            console.log(`Loaded tool: ${toolName}`);
        } catch (error) {
            toolContainer.innerHTML = `
                <div class="error">
                    <h3>Error loading tool</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()">Return Home</button>
                </div>
            `;
        }
    }
    
    window.addEventListener('resize', function() {
        const toolWrapper = document.querySelector('.tool-container');
        if (toolWrapper) {
            if (window.innerWidth <= 480) {
                toolWrapper.classList.add('mobile-view');
            } else {
                toolWrapper.classList.remove('mobile-view');
            }
        }
    });
});
