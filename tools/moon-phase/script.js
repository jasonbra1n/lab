(function () {
    // Get the astronomyLoaded state from the script tag
    const scriptElement = document.querySelector('script[src="tools/moon-phase/script.js"]');
    const astronomyLoaded = scriptElement.getAttribute('data-astronomy-loaded') === 'true';

    function getMoonPhase(date) {
        try {
            if (!astronomyLoaded) {
                throw new Error('Astronomy Engine not loaded');
            }

            // Ensure the date is in UTC
            const utcDate = new Date(Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds()
            ));

            console.log('Calling Astronomy.Illumination with date:', utcDate);
            const illumination = Astronomy.Illumination(Astronomy.Body.Moon, utcDate);
            console.log('Illumination result:', illumination);

            if (!illumination || typeof illumination.age !== 'number') {
                throw new Error('Invalid illumination data returned from Astronomy Engine');
            }

            const age = illumination.age;
            const phaseFraction = age / 29.53058867;
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
            // Fallback to approximate calculation
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
        }
    }

    function calculateNextPhases(date) {
        if (!astronomyLoaded) {
            console.error('Astronomy Engine not loaded, cannot calculate upcoming phases');
            return [
                { name: 'Full Moon', date: 'N/A' },
                { name: 'Last Quarter', date: 'N/A' },
                { name: 'New Moon', date: 'N/A' }
            ];
        }

        const nextPhases = [];
        let searchDate = new Date(Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        ));

        const phaseTypes = [
            { name: 'Full Moon', illumination: 180 },
            { name: 'Last Quarter', illumination: 270 },
            { name: 'New Moon', illumination: 0 }
        ];

        for (let i = 0; i < 3; i++) {
            const nextPhase = phaseTypes[i % phaseTypes.length];
            try {
                console.log(`Searching for ${nextPhase.name} with date:`, searchDate);
                const searchResult = Astronomy.SearchMoonPhase(nextPhase.illumination, searchDate);
                console.log(`${nextPhase.name} result:`, searchResult);

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
                    searchDate = new Date(searchResult.getTime() + 24 * 60 * 60 * 1000);
                } else {
                    nextPhases.push({ name: nextPhase.name, date: 'N/A' });
                }
            } catch (error) {
                console.error(`Error calculating ${nextPhase.name}:`, error);
                // Fallback to approximate calculation
                const lunarCycle = 29.53058867;
                const referenceNewMoon = new Date('2000-01-06T00:00:00Z');
                const timeDiff = date.getTime() - referenceNewMoon.getTime();
                const daysSinceNewMoon = (timeDiff / (1000 * 60 * 60 * 24)) % lunarCycle;
                let daysToPhase;
                if (nextPhase.name === 'Full Moon') {
                    daysToPhase = 16.5 - daysSinceNewMoon;
                } else if (nextPhase.name === 'Last Quarter') {
                    daysToPhase = 23.5 - daysSinceNewMoon;
                } else {
                    daysToPhase = 29.53058867 - daysSinceNewMoon;
                }
                const phaseDate = new Date(date.getTime() + daysToPhase * 24 * 60 * 60 * 1000);
                nextPhases.push({
                    name: nextPhase.name,
                    date: phaseDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                });
                searchDate = new Date(phaseDate.getTime() + 24 * 60 * 60 * 1000);
            }
        }

        return nextPhases;
    }

    function updateMoonPhase() {
        try {
            const dateInput = document.getElementById('date-input');
            let selectedDate = dateInput.value ? new Date(dateInput.value + 'T12:00:00Z') : new Date();

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
                    minute
