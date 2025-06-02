(function () {
    function calculateMoonPhase(date) {
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

            console.log(`Calculated phase: ${phaseName}, Days in cycle: ${cycleDays.toFixed(2)}`);
            return { phaseName, visualChar, cycleDays, age: cycleDays };
        } catch (error) {
            console.error('Error in calculateMoonPhase:', error);
            return { phaseName: 'Error', visualChar: '❓', cycleDays: 0, age: 0 };
        }
    }

    function calculateNextPhases(date) {
        const lunarCycle = 29.53058867; // Average lunar cycle in days
        const currentDate = new Date(date);
        const referenceNewMoon = new Date('2000-01-06T00:00:00Z');
        const timeDiff = currentDate.getTime() - referenceNewMoon.getTime();
        const daysSinceNewMoon = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;
        const cycleDays = daysSinceNewMoon;

        const phaseThresholds = [
            { name: 'Full Moon', threshold: 16.5 },
            { name: 'Last Quarter', threshold: 23.5 },
            { name: 'New Moon', threshold: 29.53058867 }
        ];

        const nextPhases = [];
        let remainingDays = cycleDays;

        for (let i = 0; i < 3; i++) {
            const nextPhase = phaseThresholds[i % phaseThresholds.length];
            let daysUntilNextPhase = nextPhase.threshold - remainingDays;

            // Adjust for cycle wraparound
            if (daysUntilNextPhase <= 0) {
                daysUntilNextPhase += lunarCycle;
            }

            const nextPhaseDate = new Date(currentDate.getTime() + daysUntilNextPhase * 24 * 60 * 60 * 1000);
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
            remainingDays = (remainingDays + daysUntilNextPhase) % lunarCycle;
        }

        return nextPhases;
    }

    function updateMoonPhase() {
        try {
            const dateInput = document.getElementById('date-input');
            let selectedDate = dateInput.value ? new Date(dateInput.value + 'T12:00:00') : new Date();

            const { phaseName, visualChar, cycleDays, age } = calculateMoonPhase(selectedDate);

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
