document.addEventListener('toolLoaded', (e) => {
    if (e.detail.tool === 'life-path-calculator') {
        initLifePathCalculator();
    }
});

function initLifePathCalculator() {
    const monthSelect = document.getElementById('month-select');
    const daySelect = document.getElementById('day-select');
    const yearSelect = document.getElementById('year-select');
    const resultCard = document.getElementById('result-card');

    // Populate dropdowns
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    months.forEach((month, i) => {
        monthSelect.options[i] = new Option(month, i + 1);
    });

    for (let i = 1; i <= 31; i++) {
        daySelect.options[i - 1] = new Option(i, i);
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
        yearSelect.options[currentYear - i] = new Option(i, i);
    }

    // Set default date to a sample date
    monthSelect.value = '1';
    daySelect.value = '1';
    yearSelect.value = '1990';

    // Initial calculation
    calculateLifePath();

    // Recalculate on date change
    monthSelect.addEventListener('change', calculateLifePath);
    daySelect.addEventListener('change', calculateLifePath);
    yearSelect.addEventListener('change', calculateLifePath);

    function calculateLifePath() {
        const month = parseInt(monthSelect.value);
        const day = parseInt(daySelect.value);
        const year = parseInt(yearSelect.value);

        if (!month || !day || !year) {
            resultCard.style.display = "none";
            return;
        }

        let lifePathNumber = calculateNumerology(day, month, year);
        let personality = getPersonality(lifePathNumber);
        let birthCard = getBirthCard(lifePathNumber);

        document.getElementById("lifePathNumber").innerText = lifePathNumber;
        document.getElementById("personality").innerText = personality;
        document.getElementById("birthCard").innerText = birthCard;
        resultCard.style.display = "block";
    }

    function calculateNumerology(day, month, year) {
        let dayNum = reduceToSingleDigit(day);
        let monthNum = reduceToSingleDigit(month);
        let yearNum = reduceToSingleDigit(year);

        let sum = dayNum + monthNum + yearNum;
        return reduceToSingleDigit(sum);
    }

    function reduceToSingleDigit(num) {
        if (num === 11 || num === 22 || num === 33) {
            return num;
        }

        while (num > 9) {
            num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
        }
        return num;
    }

    function getPersonality(lifePathNumber) {
        const personalityTraits = {
            1: "Independent, confident, and a natural leader.",
            2: "Diplomatic, cooperative, and sensitive.",
            3: "Creative, expressive, and social.",
            4: "Practical, hardworking, and reliable.",
            5: "Adventurous, dynamic, and freedom-loving.",
            6: "Compassionate, nurturing, and responsible.",
            7: "Introspective, spiritual, and analytical.",
            8: "Ambitious, determined, and goal-oriented.",
            9: "Idealistic, compassionate, and humanitarian.",
            11: "Intuitive, inspirational, and visionary.",
            22: "Master Builder, highly capable, and practical.",
            33: "Master Teacher, compassionate, and nurturing."
        };
        return personalityTraits[lifePathNumber] || "Unknown Personality";
    }

    function getBirthCard(lifePathNumber) {
        const cards = {
            1: "The Magician",
            2: "The High Priestess",
            3: "The Empress",
            4: "The Emperor",
            5: "The Hierophant",
            6: "The Lovers",
            7: "The Chariot",
            8: "Strength",
            9: "The Hermit",
            11: "Justice",
            22: "The Fool",
            33: "The World"
        };
        return cards[lifePathNumber] || "Unknown Card";
    }
}
