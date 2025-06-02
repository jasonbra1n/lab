(function () {
    let astronomyLoaded = false;

    function onAstroLoad() {
        astronomyLoaded = true;
        document.getElementById('loading-status').textContent = 'Astronomy Engine loaded successfully.';
        updateMoonPhase();
    }

    function onAstroError() {
        astronomyLoaded = false;
        document.getElementById('loading-status').textContent = 'Failed to load Astronomy Engine, using fallback method.';
        console.error('Failed to load Astronomy Engine from CDN');
        updateMoonPhase();
    }

    // Fallback approximate moon phase calculation
    function calculateMoonPhaseFallback(date) {
        try {
            const referenceNewMoon = new Date('2000-01-06T00:00:00Z');
            const lunarCycle = 29.53058867; // Average lunar cycle in days

            const timeDiff = date.getTime() - referenceNewMoon.getTime();
            const daysSinceNewMoon = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;
            const cycleDays = daysSinceNewMoon;

            let phaseName, visualChar;
            if (cycleDays < 1) {
                phaseName = 'New Moon';
                visualChar = '🌑';
            } else if (cycleDays < 6.5) {
                phaseName = 'Waxing Crescent';
                visualChar = '🌒';
            } else if (cycleDays < 8.5) {
                phaseName = 'First Quarter';
                visualChar = '🌓';
            } else if (cycleDays < 13.5) {
                phaseName = 'Waxing Gibbous';
                visualChar = '🌔';
            } else if (cycleDays < 16.5) {
                phaseName = 'Full Moon';
                visualChar = '🌕';
            } else if (cycleDays < 21.5) {
                phaseName = 'Waning Gibbous';
                visualChar = '🌖';
            } else if (cycleDays < 23.5) {
                phaseName = 'Last Quarter';
                visualChar = '🌗';
            } else if (cycleDays < 28.5) {
                phaseName = 'Waning Crescent';
                visualChar = '🌘';
            } else {
                phaseName = 'New Moon';
                visualChar = '🌑';
            }

            console.log(`Fallback - Calculated phase: ${phaseName}, Days in cycle: ${cycleDays.toFixed(2)}`);
            return { phaseName, visualChar, cycleDays, age: cycleDays };
        } catch (error) {
            console.error('Error in calculateMoonPhaseFallback:', error);
            return { phaseName: 'Error', visualChar: '❓', cycleDays: 0, age: 0 };
        }
    }

    function getMoonPhase(date) {
        try {
            if (!astronomyLoaded) {
                console.warn('Astronomy Engine not loaded, using fallback method');
                return calculateMoonPhaseFallback(date);
            }

            const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);
            const age = illumination.age; // Days since the last New Moon
            const phaseFraction = age / 29.53058867; // Normalize to lunar cycle
            const cycleDays = age % 29.53058867;

            let phaseName, visualChar;
            if (phaseFraction < 0.25) {
                phaseName = 'New Moon';
                visualChar = '🌑';
            } else if (phaseFraction < 0.5) {
                phaseName = 'Waxing Crescent';
                visualChar = '🌒';
            } else if (phaseFraction < 0.75) {
                if (cycleDays < 8.5) {
                    phaseName = 'First Quarter';
                    visualChar = '🌓';
                } else if (cycleDays < 13.5) {
                    phaseName = 'Waxing Gibbous';
                    visualChar = '🌔';
                } else {
                    phaseName = 'Full Moon';
                    visualChar = '🌕';
                }
            } else {
                if (cycleDays < 21.5) {
                    phaseName = 'Waning Gibbous';
                    visualChar = '🌖';
                } else if (cycleDays < 23.5) {
                    phaseName = 'Last Quarter';
                    visualChar = '🌗';
                } else {
                    phaseName = 'Waning Crescent';
                    visualChar = '🌘';
                }
            }

            console.log(`Calculated phase: ${phaseName}, Age: ${age.toFixed(2)} days`);
            return { phaseName, visualChar, cycleDays, age };
        } catch (error) {
            console.error('Error in getMoonPhase:', error);
            return calculateMoonPhaseFallback(date);
        }
    }

    function calculateNextPhases(date) {
        if (!astronomyLoaded) {
            // Fallback approximate next phases
            const lunarCycle = 29.53058867;
            const currentDate = new Date(date);
            const referenceNewMoon = new Date('2000-01-06T00:00:00Z');
            const timeDiff = currentDate.getTime() - referenceNewMoon.getTime();
            const daysSinceNewMoon = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;
            const daysToFull = 16.5 - daysSinceNewMoon;
            const daysToLast = 23.5 - daysSinceNewMoon;
            const daysToNew = 29.53058867 - daysSinceNewMoon;

            return [
                { name: 'Full Moon', date: new Date(currentDate.getTime() + daysToFull * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { name: 'Last Quarter', date: new Date(currentDate.getTime() + daysToLast * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
                { name: 'New Moon', date: new Date(currentDate.getTime() + daysToNew * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }
            ];
        }

        const nextPhases = [];
        let searchDate = new Date(date);

        const phaseTypes = [
            { name: 'Full Moon', illumination: 180 }, // Full Moon at 180 degrees
            { name: 'Last Quarter', illumination: 270 }, // Last Quarter at 270 degrees
            { name: 'New Moon', illumination: 0 } // New Moon at 0 degrees
        ];

        for (let i = 0; i < 3; i++) {
            const nextPhase = phaseTypes[i % phaseTypes.length];
            const searchResult = Astronomy.SearchMoonPhase(nextPhase.illumination, searchDate);
            if (searchResult) {
                nextPhases.push({
                    name: nextPhase.name,
                    date: searchResult.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                });
                searchDate = new Date(searchResult.getTime() + 24 * 60 * 60 * 1000); // Move past this phase
            } else {
                nextPhases.push({ name: nextPhase.name, date: 'N/A' });
            }
        }

        return nextPhases;
    }

    function updateMoonPhase() {
        try {
            const dateInput = document.getElementById('date-input');
            let selectedDate = dateInput.value ? new Date(dateInput.value + 'T12:00:00') : new Date();

            const { phaseName, visualChar, cycleDays, age } = getMoonPhase(selectedDate);

            const phaseNameElement = document.getElementById('phase-name');
            const moonVisualElement = document.getElementById('moon-visual');
            const currentDateElement = document.getElementById('current-date');
            const phaseListElement = document.getElementById('phase-list');

            if (phaseNameElement && moonVisualElement && currentDateElement && phaseListElement) {
                phaseNameElement.textContent = phaseName;
                moonVisualElement.textContent = visualChar;
                currentDateElement.textContent = selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                const nextPhases = calculateNextPhases(selectedDate);
                phaseListElement.innerHTML = nextPhases.map(phase => 
                    `<div>${phase.name}: ${phase.date}</div>`
                ).join('');

                console.log('UI updated successfully');
            } else {
                console.error('One or more DOM elements not found');
            }
        } catch (error) {
            console.error('Error in updateMoonPhase:', error);
        }
    }

    function resetToCurrentDate() {
        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            dateInput.value = ''; // Clear the date picker
        }
        updateMoonPhase(); // Update with the current date
    }

    // Initial setup with timeout to handle loading
    setTimeout(() => {
        if (!astronomyLoaded) {
            onAstroError();
        } else {
            updateMoonPhase();
        }
    }, 2000); // Wait 2 seconds for CDN to load

    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', resetToCurrentDate);
    } else {
        console.error('Refresh button not found');
    }

    // Date picker change event
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        dateInput.addEventListener('change', updateMoonPhase);
    } else {
        console.error('Date input not found');
    }

    // Cleanup event listeners when the tool is unloaded
    function cleanup() {
        if (refreshBtn) {
            refreshBtn.removeEventListener('click', resetToCurrentDate);
        }
        if (dateInput) {
            dateInput.removeEventListener('change', updateMoonPhase);
        }
        console.log('Moon Phase tool cleaned up');
    }

    // Listen for toolChange event to cleanup
    document.addEventListener('toolChange', function (e) {
        if (e.detail.tool !== 'moon-phase') {
            cleanup();
        }
    });
})();
