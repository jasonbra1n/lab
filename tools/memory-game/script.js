function initMemoryGame() {
    console.log('Initializing Memory Game');
    const emojis = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎰', '🎲', '🎸'];
    let cards = [];
    let flippedCards = [];
    let moves = 0;
    let matches = 0;
    let gameStarted = false;
    let startTime = null;
    let elapsedTime = 0;
    let timerInterval = null;

    function initializeGame() {
        console.log('Initializing game state');
        cards = [];
        flippedCards = [];
        moves = 0;
        matches = 0;
        gameStarted = false;
        startTime = null;
        elapsedTime = 0;
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        const shuffledEmojis = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5);
        
        cards = shuffledEmojis.map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        }));
        
        renderCards();
        updateStats();
        hideWinModal();
    }

    function renderCards() {
        console.log('Rendering cards');
        const gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) {
            console.error('Game board not found');
            return;
        }
        gameBoard.innerHTML = '';
        
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`;
            cardElement.onclick = () => handleCardClick(card.id);
            
            cardElement.innerHTML = `
                <div class="card-content">${card.emoji}</div>
                <div class="card-back">?</div>
            `;
            
            gameBoard.appendChild(cardElement);
        });
    }

    function handleCardClick(cardId) {
        console.log(`Card clicked: ${cardId}`);
        if (!gameStarted) {
            gameStarted = true;
            startTime = Date.now();
            startTimer();
        }
        
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) {
            return;
        }
        
        card.isFlipped = true;
        flippedCards.push(cardId);
        renderCards();
        
        if (flippedCards.length === 2) {
            moves++;
            updateStats();
            
            const [firstId, secondId] = flippedCards;
            const firstCard = cards.find(c => c.id === firstId);
            const secondCard = cards.find(c => c.id === secondId);
            
            if (firstCard.emoji === secondCard.emoji) {
                setTimeout(() => {
                    firstCard.isMatched = true;
                    secondCard.isMatched = true;
                    matches++;
                    updateStats();
                    flippedCards = [];
                    renderCards();
                    
                    if (matches === emojis.length) {
                        endGame();
                    }
                }, 600);
            } else {
                setTimeout(() => {
                    firstCard.isFlipped = false;
                    secondCard.isFlipped = false;
                    flippedCards = [];
                    renderCards();
                }, 1000);
            }
        }
    }

    function startTimer() {
        console.log('Starting timer');
        timerInterval = setInterval(() => {
            elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            updateStats();
        }, 1000);
    }

    function updateStats() {
        document.getElementById('moves').textContent = moves;
        document.getElementById('matches').textContent = `${matches}/${emojis.length}`;
        document.getElementById('time').textContent = formatTime(elapsedTime);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function endGame() {
        console.log('Game ended');
        clearInterval(timerInterval);
        const winModal = document.getElementById('winModal');
        const winMessage = document.getElementById('winMessage');
        
        winMessage.textContent = `You completed the game in ${moves} moves and ${formatTime(elapsedTime)}!`;
        winModal.classList.add('show');
    }

    function hideWinModal() {
        document.getElementById('winModal').classList.remove('show');
    }

    initializeGame();

    document.getElementById('restartBtn').addEventListener('click', initializeGame);
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        hideWinModal();
        initializeGame();
    });
}

// Ensure the game initializes when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMemoryGame);
} else {
    initMemoryGame();
}
