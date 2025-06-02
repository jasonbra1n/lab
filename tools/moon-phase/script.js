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
        return { phaseName, visualChar, cycleDays };
    } catch (error) {
        console.error('Error in calculateMoonPhase:', error);
        return { phaseName: 'Error', visualChar: '❓', cycleDays: 0 };
    }
}

function updateMoonPhase() {
    try {
        const currentDate = new Date(); // Use current date and time (12:38 PM EDT, June 2, 2025)
        const { phaseName, visualChar, cycleDays } = calculateMoonPhase(currentDate);

        // Update the UI
        const phaseNameElement = document.getElementById('phase-name');
        const moonVisualElement = document.getElementById('moon-visual');
        const currentDateElement = document.getElementById('current-date');

        if (phaseNameElement && moonVisualElement && currentDateElement) {
            phaseNameElement.textContent = phaseName;
            moonVisualElement.textContent = visualChar;
            currentDateElement.textContent = currentDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            console.log('UI updated successfully');
        } else {
            console.error('One or more DOM elements not found');
        }
    } catch (error) {
        console.error('Error in updateMoonPhase:', error);
    }
}

// Run immediately when the script loads
document.addEventListener('DOMContentLoaded', updateMoonPhase); // Fallback, though dynamic loading might bypass this
updateMoonPhase(); // Immediate execution

// Refresh button
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', updateMoonPhase);
} else {
    console.error('Refresh button not found');
}
