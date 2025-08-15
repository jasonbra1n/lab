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

const script = document.createElement('script');
script.src = '/tools/moon-phase/astronomy.browser.js';
document.body.appendChild(script);

// Optionally, use onload to run code after it's loaded
script.onload = () => {
  // Call functions or use objects provided by astronomy.browser.js
};
