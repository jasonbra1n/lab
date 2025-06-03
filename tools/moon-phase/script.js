document.addEventListener('DOMContentLoaded', function() {
    updateMoonPhase();
    setInterval(updateMoonPhase, 60000); // Update every minute
});

async function updateMoonPhase() {
    const date = new Date();
    console.log(`Calling Astronomy.Illumination with date: ${date}`);
    let illum;
    try {
        illum = Astronomy.Illumination(Body.Moon, date);
    } catch (e) {
        console.error(`Error in Astronomy.Illumination: ${e.message}`);
        illum = null;
    }

    if (illum && typeof illum.age === 'number' && Number.isFinite(illum.age)) {
        console.log(`Illumination result: age = ${illum.age} days`);
        const phase = getMoonPhase(illum.age);
        document.getElementById('moon-phase').textContent = phase.name;
        document.getElementById('moon-icon').className = `moon-${phase.icon}`;
        document.getElementById('days-in-cycle').textContent = illum.age.toFixed(2);

        // Calculate next phases
        const nextPhases = calculateNextPhases(date, illum.age);
        document.getElementById('next-full-moon').textContent = nextPhases.fullMoon.toISOString().split('T')[0];
        document.getElementById('next-last-quarter').textContent = nextPhases.lastQuarter.toISOString().split('T')[0];
        document.getElementById('next-new-moon').textContent = nextPhases.newMoon.toISOString().split('T')[0];
        document.getElementById('loading-status').textContent = '';
    } else {
        console.error('Invalid illumination data returned from Astronomy Engine');
        // Fallback calculation
        const fallbackAge = approximateMoonAge(date);
        const fallbackPhase = getMoonPhase(fallbackAge);
        document.getElementById('moon-phase').textContent = fallbackPhase.name;
        document.getElementById('moon-icon').className = `moon-${fallbackPhase.icon}`;
        document.getElementById('days-in-cycle').textContent = fallbackAge.toFixed(2);

        // Fallback next phases
        const fallbackNext = calculateNextPhasesFallback(date, fallbackAge);
        document.getElementById('next-full-moon').textContent = fallbackNext.fullMoon.toISOString().split('T')[0];
        document.getElementById('next-last-quarter').textContent = fallbackNext.lastQuarter.toISOString().split('T')[0];
        document.getElementById('next-new-moon').textContent = fallbackNext.newMoon.toISOString().split('T')[0];
        document.getElementById('loading-status').textContent = 'Using fallback data.';
        console.log(`Fallback - Calculated phase: ${fallbackPhase.name}, Days in cycle: ${fallbackAge.toFixed(2)}`);
    }
}

function getMoonPhase(age) {
    const cycle = 29.530588; // Average length of a synodic month in days
    const fraction = age / cycle;
    if (fraction < 0.02 || fraction >= 0.98) {
        return { name: 'New Moon', icon: 'new' };
    } else if (fraction < 0.23) {
        return { name: 'Waxing Crescent', icon: 'waxing-crescent' };
    } else if (fraction < 0.27) {
        return { name: 'First Quarter', icon: 'first-quarter' };
    } else if (fraction < 0.48) {
        return { name: 'Waxing Gibbous', icon: 'waxing-gibbous' };
    } else if (fraction < 0.52) {
        return { name: 'Full Moon', icon: 'full' };
    } else if (fraction < 0.73) {
        return { name: 'Waning Gibbous', icon: 'waning-gibbous' };
    } else if (fraction < 0.77) {
        return { name: 'Last Quarter', icon: 'last-quarter' };
    } else {
        return { name: 'Waning Crescent', icon: 'waning-crescent' };
    }
}

// Helper function to approximate moon age (simplified fallback)
function approximateMoonAge(date) {
    const jd = (date.getTime() / 86400000) + 2440587.5; // Convert to Julian Day
    const newMoonJD = Math.floor(jd / 29.530588) * 29.530588 + 2440587.5;
    return (jd - newMoonJD + 0.5) % 29.530588;
}

// Calculate upcoming phases using Astronomy Engine
function calculateNextPhases(date, age) {
    const phases = {};
    try {
        // Search for the next Full Moon (phase angle 180°)
        const fullMoon = Astronomy.SearchMoonPhase(180, new Date(date));
        if (!fullMoon || !Number.isFinite(fullMoon.getTime())) {
            throw new Error('Invalid Full Moon date');
        }
        phases.fullMoon = fullMoon;

        // Search for the next Last Quarter (phase angle 270°)
        const lastQuarter = Astronomy.SearchMoonPhase(270, new Date(date));
        if (!lastQuarter || !Number.isFinite(lastQuarter.getTime())) {
            throw new Error('Invalid Last Quarter date');
        }
        phases.lastQuarter = lastQuarter;

        // Search for the next New Moon (phase angle 0°)
        const newMoon = Astronomy.SearchMoonPhase(0, new Date(date));
        if (!newMoon || !Number.isFinite(newMoon.getTime())) {
            throw new Error('Invalid New Moon date');
        }
        phases.newMoon = newMoon;

        return phases;
    } catch (e) {
        console.error(`Error calculating phases: ${e.message}`);
        return calculateNextPhasesFallback(date, age);
    }
}

// Fallback method to calculate upcoming phases
function calculateNextPhasesFallback(date, age) {
    const cycle = 29.530588; // Average length of a synodic month in days
    const daysSinceNew = age;
    const phases = {
        fullMoon: new Date(date.getTime() + (14.765294 - daysSinceNew) * 86400000), // Approx Full Moon
        lastQuarter: new Date(date.getTime() + (22.147941 - daysSinceNew) * 86400000), // Approx Last Quarter
        newMoon: new Date(date.getTime() + (cycle - daysSinceNew) * 86400000) // Next New Moon
    };
    return phases;
}
