function initMathCalculator() {
    const display = document.getElementById("display");
    const history = document.getElementById("history");
    const calculator = document.querySelector(".calculator");

    // Sync calculator theme with SPA theme on load
    if (document.documentElement.classList.contains('dark-theme')) {
        calculator.classList.remove('light');
    } else {
        calculator.classList.add('light');
    }

    // Listen for SPA theme changes
    document.addEventListener('themeChange', (event) => {
        if (event.detail.isDark) {
            calculator.classList.remove('light');
        } else {
            calculator.classList.add('light');
        }
    });

    function appendValue(value) {
        const validChars = "0123456789.+-*/";
        if (display.value.length < 20 && validChars.includes(value)) {
            display.value += value;
        }
    }

    function clearDisplay() {
        display.value = "";
    }

    function backspace() {
        display.value = display.value.slice(0, -1);
    }

    function calculate() {
        try {
            const result = Function('"use strict"; return (' + display.value.replace("×", "*").replace("÷", "/") + ')')();
            if (isNaN(result) || !isFinite(result)) {
                display.value = "Invalid Input";
            } else {
                history.textContent = display.value + " = " + result;
                display.value = result;
            }
        } catch (error) {
            display.value = "Error";
        }
    }

    function toggleTheme() {
        // Sync with SPA's theme toggle
        const htmlEl = document.documentElement;
        if (htmlEl.classList.contains('dark-theme')) {
            htmlEl.classList.remove('dark-theme');
            htmlEl.classList.add('light-theme');
            calculator.classList.add('light');
            localStorage.setItem('theme', 'light-theme');
        } else {
            htmlEl.classList.remove('light-theme');
            htmlEl.classList.add('dark-theme');
            calculator.classList.remove('light');
            localStorage.setItem('theme', 'dark-theme');
        }
        updateThemeIcon(); // Call SPA's theme icon update
    }

    function copyResult() {
        navigator.clipboard.writeText(display.value)
            .then(() => alert("Result copied to clipboard!"))
            .catch(() => alert("Failed to copy result."));
    }

    function clearHistory() {
        history.textContent = "";
    }

    document.addEventListener("keydown", (event) => {
        const key = event.key;
        const validKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "+", "-", "*", "/", "Enter", "Backspace", "Delete"];
        if (validKeys.includes(key)) {
            event.preventDefault();
            if (key === "Enter") {
                calculate();
            } else if (key === "Backspace" || key === "Delete") {
                backspace();
            } else {
                appendValue(key);
            }
        }
    });

    // Expose functions globally for inline onclick handlers
    window.appendValue = appendValue;
    window.clearDisplay = clearDisplay;
    window.backspace = backspace;
    window.calculate = calculate;
    window.toggleTheme = toggleTheme;
    window.copyResult = copyResult;
    window.clearHistory = clearHistory;
}

if (document.getElementById("display")) {
    initMathCalculator();
}