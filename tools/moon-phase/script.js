function calculateMoonPhase(date) {
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

    return { phaseName, visualChar, cycleDays };
}

function updateMoonPhase() {
    const currentDate = new Date(); // Use current date (June 2, 2025, as provided)
    const { phaseName, visualChar, cycleDays } = calculateMoonPhase(currentDate);

    // Update the UI
    document.getElementById('phase-name').textContent = phaseName;
    document.getElementById('moon-visual').textContent = visualChar;
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Log for debugging
    console.log(`Moon phase on ${currentDate}: ${phaseName}, Days in cycle: ${cycleDays.toFixed(2)}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initial calculation
    updateMoonPhase();

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', updateMoonPhase);
});
