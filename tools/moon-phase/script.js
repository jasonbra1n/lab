(function () {
    function calculateMoonPhase(date) {
        try {
            // Reference New Moon: January 6, 2000 (approximate for simplicity)
            const referenceNewMoon = new Date('2000-01-06T00:00:00Z');
            const lunarCycle = 29.53058867; // Average lunar cycle in days

            // Calculate days since the reference New Moon
            const timeDiff = date.getTime() - referenceNewMoon.getTime();
            const daysSinceNewMoon = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;

            // Normalize to a 0-1 cycle (0 = New Moon, 0.5 = Full Moon)
            const cycleFraction = daysSinceNewMoon / lunarCycle;
            const cycleDays = daysSinceNewMoon;

            // Determine the moon phase based on the cycle fraction
            let phaseName, visualChar, phaseIndex;
            if (cycleDays < 1) {
                phaseName = 'New Moon';
                visualChar = '🌑';
                phaseIndex = 0;
            } else if (cycleDays < 6.5) {
                phaseName = 'Waxing Crescent';
                visualChar = '🌒';
                phaseIndex = 1;
            } else if (cycleDays < 8.5) {
                phaseName = 'First Quarter';
                visualChar = '🌓';
                phaseIndex = 2;
            } else if (cycleDays < 13.5) {
                phaseName = 'Waxing Gibbous';
                visualChar = '🌔';
                phaseIndex = 3;
            } else if (cycleDays < 16.5) {
                phaseName = 'Full Moon';
                visualChar = '🌕';
                phaseIndex = 4;
            } else if (cycleDays < 21.5) {
                phaseName = 'Waning Gibbous';
                visualChar = '🌖';
                phaseIndex = 5;
            } else if (cycleDays < 23.5) {
                phaseName = 'Last Quarter';
                visualChar = '🌗';
                phaseIndex = 6;
            } else if (cycleDays < 28.5) {
                phaseName = 'Waning Crescent';
                visualChar = '🌘';
                phaseIndex = 7;
            } else {
                phaseName = 'New Moon';
                visualChar = '🌑';
                phaseIndex = 0;
            }

            console.log(`Calculated phase: ${phaseName}, Days in cycle: ${cycleDays.toFixed(2)}`);
            return { phaseName, visualChar, cycleDays, phaseIndex };
        } catch (error) {
            console.error('Error in calculateMoonPhase:', error);
            return { phaseName: 'Error', visualChar: '❓', cycleDays: 0, phaseIndex: -1 };
        }
    }

    function calculateNextPhases(date, currentCycleDays, currentPhaseIndex) {
        const lunarCycle = 29.53058867; // Average lunar cycle in days
        const phaseDurations = [
            { name: 'New Moon', threshold: 1, index: 0 },
            { name: 'Waxing Crescent', threshold: 6.5, index: 1 },
            { name: 'First Quarter', threshold: 8.5, index: 2 },
            { name: 'Waxing Gibbous', threshold: 13.5, index: 3 },
            { name: 'Full Moon', threshold: 16.5, index: 4 },
            { name: 'Waning Gibbous', threshold: 21.5, index: 5 },
            { name: 'Last Quarter', threshold: 23.5, index: 6 },
            { name: 'Waning Crescent', threshold: 28.5, index: 7 },
            { name: 'New Moon', threshold: lunarCycle, index: 0 }
        ];

        const nextPhases = [];
        let remainingDays = currentCycleDays;
        let currentIndex = currentPhaseIndex;

        // Calculate the next three phases
        for (let i = 0; i < 3; i++) {
            // Find the next phase
            currentIndex = (currentIndex + 1) % 8;
            const nextPhase = phaseDurations[currentIndex === 0 ? 8 : currentIndex];
            const daysUntilNextPhase = nextPhase.threshold - remainingDays;

            // Adjust for wrapping around the lunar cycle
            const daysToAdd = daysUntilNextPhase <= 0 ? daysUntilNextPhase + lunarCycle : daysUntilNextPhase;
            const nextPhaseDate = new Date(date.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

            nextPhases.push({
                name: nextPhase.name,
                date: nextPhaseDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });

            // Update remaining days for the next iteration
            remainingDays = (remainingDays + daysToAdd) % lunarCycle;
        }

        return nextPhases;
    }

    function updateMoonPhase() {
        try {
            // Use date picker value if set, otherwise default to current date
            const dateInput = document.getElementById('date-input');
            let selectedDate = dateInput.value ? new Date(dateInput.value + 'T12:00:00') : new Date();

            const { phaseName, visualChar, cycleDays, phaseIndex } = calculateMoonPhase(selectedDate);

            // Update the UI
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

                // Calculate and display the next three phases
                const nextPhases = calculateNextPhases(selectedDate, cycleDays, phaseIndex);
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

    // Initial setup
    updateMoonPhase();

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
