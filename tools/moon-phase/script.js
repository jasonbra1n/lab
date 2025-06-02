(function () {
    // The Astronomy Engine is no longer used, so no need to check if it's loaded.

    function getMoonPhase(date) {
        // Fallback to approximate calculation (now the primary method)
        const referenceNewMoon = new Date('2000-01-06T00:00:00Z'); // A known New Moon date
        const lunarCycle = 29.53058867; // Average lunar cycle in days

        // Ensure the date is processed as UTC to match the referenceNewMoon which is in UTC
        const utcDate = new Date(Date.UTC(
            date.getFullYear(), // Use getFullYear for local date, then convert to UTC parts
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        ));

        const timeDiff = utcDate.getTime() - referenceNewMoon.getTime();
        let cycleDays = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;
        if (cycleDays < 0) { // Ensure cycleDays is positive
            cycleDays += lunarCycle;
        }

        let phaseName, visualChar;
        // Determine phase based on the day in the lunar cycle
        if (cycleDays < 1) {
            phaseName = 'New Moon';
            visualChar = '🌑';
        } else if (cycleDays < 6.3826) { // Approx. 29.53 * (1/4) * (1/2) + 1  (Midpoint of New Moon to First Quarter)
            phaseName = 'Waxing Crescent';
            visualChar = '🌒';
        } else if (cycleDays < 8.3826) { // Approx. 29.53 * (1/4) + 1
            phaseName = 'First Quarter';
            visualChar = '🌓';
        } else if (cycleDays < 13.7652) { // Approx. 29.53 * (1/2) * (1/2) + 7.3826 (Midpoint of First Quarter to Full Moon)
            phaseName = 'Waxing Gibbous';
            visualChar = '🌔';
        } else if (cycleDays < 16.7652) { // Approx. 29.53 * (1/2) + 1
            phaseName = 'Full Moon';
            visualChar = '🌕';
        } else if (cycleDays < 21.1478) { // Approx. 29.53 * (3/4) * (1/2) + 14.7652 (Midpoint of Full Moon to Last Quarter)
            phaseName = 'Waning Gibbous';
            visualChar = '🌖';
        } else if (cycleDays < 23.1478) { // Approx. 29.53 * (3/4) + 1
            phaseName = 'Last Quarter';
            visualChar = '🌗';
        } else if (cycleDays < 28.5305) { // Approx. 29.53 * (1) * (1/2) + 22.1478 (Midpoint of Last Quarter to New Moon)
            phaseName = 'Waning Crescent';
            visualChar = '🌘';
        } else {
            phaseName = 'New Moon'; // End of cycle, back to New Moon
            visualChar = '🌑';
        }
        
        // The 'age' variable here represents days into the current approximate cycle.
        console.log(`Internal calculation - Phase: ${phaseName}, Cycle Day: ${cycleDays.toFixed(2)}`);
        return { phaseName, visualChar, cycleDays, age: cycleDays };
    }

    function calculateNextPhases(currentDate) {
        const nextPhases = [];
        const lunarCycle = 29.53058867;
        const referenceNewMoon = new Date('2000-01-06T00:00:00Z');

        // Ensure currentDate is processed as UTC for calculations
        const utcCurrentDate = new Date(Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
        )); // Time components are not strictly necessary here as we deal with days

        const timeDiffCurrent = utcCurrentDate.getTime() - referenceNewMoon.getTime();
        let daysIntoCurrentCycle = (timeDiffCurrent / (1000 * 60 * 60 * 24)) % lunarCycle;
        if (daysIntoCurrentCycle < 0) {
            daysIntoCurrentCycle += lunarCycle;
        }

        const phaseTargets = [
            { name: 'New Moon', targetCycleDay: 0 }, // Or lunarCycle for the *next* new moon
            { name: 'First Quarter', targetCycleDay: lunarCycle * 0.25 },
            { name: 'Full Moon', targetCycleDay: lunarCycle * 0.5 },
            { name: 'Last Quarter', targetCycleDay: lunarCycle * 0.75 }
        ];
        
        // We want to find the next upcoming New Moon, Full Moon, and Last Quarter
        // For simplicity, we'll list the next instances of these major phases
        // starting from after the current date.

        let searchStartDate = new Date(utcCurrentDate);

        // Find the next New Moon to align our search
        let daysToNextNewMoon = lunarCycle - daysIntoCurrentCycle;
        if (daysToNextNewMoon < 0) daysToNextNewMoon += lunarCycle; // Should already be positive if daysIntoCurrentCycle is correct
        if (daysToNextNewMoon > (lunarCycle -1) && daysToNextNewMoon < (lunarCycle +1) ) daysToNextNewMoon = 0; // If it's practically new moon day

        let nextNewMoonDate = new Date(searchStartDate.getTime() + daysToNextNewMoon * 24 * 60 * 60 * 1000);
        
        // Add upcoming phases relative to the next New Moon
        const upcoming = [
            { name: 'New Moon', offset: 0 },
            { name: 'First Quarter', offset: lunarCycle * 0.25 },
            { name: 'Full Moon', offset: lunarCycle * 0.5 },
            { name: 'Last Quarter', offset: lunarCycle * 0.75 },
            { name: 'New Moon', offset: lunarCycle }, // Next new moon
            { name: 'First Quarter', offset: lunarCycle * 1.25 },
            { name: 'Full Moon', offset: lunarCycle * 1.5 },
            // Add more if needed
        ];
        
        let addedPhasesCount = 0;
        for (const phase of upcoming) {
            const phaseDate = new Date(nextNewMoonDate.getTime() + phase.offset * 24 * 60 * 60 * 1000);
            // Ensure the phaseDate is after or on the current displayed date (adjusted for UTC)
            if (phaseDate.getTime() >= utcCurrentDate.getTime()) {
                 nextPhases.push({
                    name: phase.name,
                    date: phaseDate.toLocaleDateString('en-US', {
                        timeZone: 'UTC', // Display the UTC date
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                });
                addedPhasesCount++;
                if (addedPhasesCount >= 3) break; // Get the next 3 distinct major phases
            }
        }
        
        // If less than 3 phases found (e.g. near end of a known cycle definition), 
        // this may need more robust future projection.
        // The current approach shows next occurrences based on a calculated upcoming new moon.

        console.log('Internal calculation - Upcoming phases:', nextPhases);
        return nextPhases;
    }

    function updateMoonPhase() {
        try {
            const dateInput = document.getElementById('date-input');
            // Use local time from date picker, then convert to UTC for calculation if needed.
            // Default to current local time.
            let selectedDate;
            if (dateInput.value) {
                // Input type="date" provides value as YYYY-MM-DD.
                // Interpret this as local date, and set time to midday to avoid timezone shifts affecting the date itself.
                const [year, month, day] = dateInput.value.split('-').map(Number);
                selectedDate = new Date(year, month - 1, day, 12, 0, 0); // Local time
            } else {
                selectedDate = new Date(); // Current local time
            }

            const { phaseName, visualChar } = getMoonPhase(selectedDate);

            const phaseNameElement = document.getElementById('phase-name');
            const moonVisualElement = document.getElementById('moon-visual');
            const currentDateElement = document.getElementById('current-date');
            const phaseListElement = document.getElementById('phase-list');
            const loadingStatusElement = document.getElementById('loading-status');

            if (phaseNameElement && moonVisualElement && currentDateElement && phaseListElement) {
                phaseNameElement.textContent = phaseName;
                moonVisualElement.textContent = visualChar;
                
                // Display selectedDate in local time format
                currentDateElement.textContent = selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                const nextPhasesData = calculateNextPhases(selectedDate);
                phaseListElement.innerHTML = nextPhasesData.map(phase => 
                    `<div>${phase.name}: ${phase.date}</div>`
                ).join('');
                
                if(loadingStatusElement) {
                    loadingStatusElement.textContent = ''; // Clear "Loading..." message
                    loadingStatusElement.style.display = 'none'; // Hide it
                }
                console.log('UI updated successfully using internal calculation');
            } else {
                console.error('One or more DOM elements not found for UI update');
            }
        } catch (error) {
            console.error('Error in updateMoonPhase:', error);
            const loadingStatusElement = document.getElementById('loading-status');
            if(loadingStatusElement) {
                loadingStatusElement.textContent = 'Error updating moon phase.';
                loadingStatusElement.style.display = 'block';
            }
        }
    }

    function resetToCurrentDate() {
        const dateInput = document.getElementById('date-input');
        if (dateInput) {
            dateInput.value = ''; // Clear the date picker
        }
        updateMoonPhase();
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
    // Ensure this event is dispatched by your main script when tools are switched
    document.addEventListener('toolChange', function handleToolChange(event) {
        // Assuming your main script's event.detail.tool provides the new tool's name
        if (event.detail.tool !== 'moon-phase') {
            cleanup();
            // It's good practice to remove the event listener itself if the tool is permanently unloaded
            // or ensure it doesn't fire again if this script instance is discarded.
            // However, if this script is re-evaluated on each tool load, this is fine.
            document.removeEventListener('toolChange', handleToolChange); // Self-removal if appropriate
        }
    });

})();
