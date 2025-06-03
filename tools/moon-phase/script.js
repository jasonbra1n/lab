console.log('Moon Phase script loaded and executing - No Event Listener');

const phaseNameElement = document.getElementById('phase-name');
if (phaseNameElement) {
    phaseNameElement.textContent = 'Script Test Phase';
    console.log('Updated phase name to Script Test Phase');
} else {
    console.error('Phase name element not found');
}

const currentDateElement = document.getElementById('current-date');
if (currentDateElement) {
    currentDateElement.textContent = new Date().toISOString().split('T')[0];
    console.log('Updated current date');
} else {
    console.error('Current date element not found');
}

const loadingStatusElement = document.getElementById('loading-status');
if (loadingStatusElement) {
    loadingStatusElement.textContent = 'Loaded (Script Test)';
    console.log('Updated loading status');
} else {
    console.error('Loading status element not found');
}
