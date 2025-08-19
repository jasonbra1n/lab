window.radioStreamState = window.radioStreamState || {
    audio: null,
    isPlaying: false,
    currentStation: null,
    volume: 0.5,
    audioContext: null,
    source: null,
    splitter: null,
    analyserLeft: null,
    analyserRight: null,
    animationFrameId: null,
    popoutWindow: null,
    vuStyle: 1 // Track current VU meter style (1 = LED default)
};

const VU_STYLES = [
    'classic', 'led', 'circular', 'waveform', 'spectrum', 'retro'
];

function initRadioStreamPlayer() {
    const state = window.radioStreamState;
    let audio = state.audio;
    let audioContext = state.audioContext;
    let source = state.source;
    let splitter = state.splitter;
    let analyserLeft = state.analyserLeft;
    let analyserRight = state.analyserRight;

    const stationSelect = document.getElementById('station-select');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const popoutBtn = document.getElementById('popout-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const nowPlaying = document.getElementById('now-playing');
    const leftVu = document.getElementById('left-vu');
    const rightVu = document.getElementById('right-vu');
    const vuMeters = document.querySelector('.vu-meters');

    // Create VU style cycle button
    if (!document.getElementById('vu-style-btn')) {
        const vuStyleBtn = document.createElement('button');
        vuStyleBtn.id = 'vu-style-btn';
        vuStyleBtn.className = 'vu-style-btn';
        vuStyleBtn.innerHTML = '◉';
        vuStyleBtn.title = 'Cycle VU Meter Style';
        vuMeters.appendChild(vuStyleBtn);
        
        vuStyleBtn.addEventListener('click', () => {
            state.vuStyle = (state.vuStyle + 1) % VU_STYLES.length;
            updateVuStyle();
        });
    }

    if (!audio) {
        audio = new Audio();
        audio.crossOrigin = 'anonymous';
        state.audio = audio;

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        splitter = audioContext.createChannelSplitter(2);
        analyserLeft = audioContext.createAnalyser();
        analyserRight = audioContext.createAnalyser();
        analyserLeft.fftSize = 1024;
        analyserRight.fftSize = 1024;

        source.connect(splitter);
        splitter.connect(analyserLeft, 0);
        splitter.connect(analyserRight, 1);
        source.connect(audioContext.destination);

        state.audioContext = audioContext;
        state.source = source;
        state.splitter = splitter;
        state.analyserLeft = analyserLeft;
        state.analyserRight = analyserRight;
    }

    const bufferLength = analyserLeft.frequencyBinCount;
    const dataArrayLeft = new Uint8Array(bufferLength);
    const dataArrayRight = new Uint8Array(bufferLength);
    const frequencyDataLeft = new Uint8Array(bufferLength);
    const frequencyDataRight = new Uint8Array(bufferLength);

    audio.src = state.currentStation || stationSelect.value;
    audio.volume = state.volume || volumeSlider.value;
    let isPlaying = state.isPlaying;

    if (state.currentStation) {
        stationSelect.value = state.currentStation;
    }
    volumeSlider.value = audio.volume;
    playPauseBtn.textContent = isPlaying ? 'Pause' : 'Play';

    // Initialize VU style
    updateVuStyle();

    function updateVuStyle() {
        const currentStyle = VU_STYLES[state.vuStyle];
        vuMeters.className = `vu-meters vu-${currentStyle}`;
        
        // Clear existing content and rebuild based on style
        leftVu.innerHTML = '';
        rightVu.innerHTML = '';
        
        switch(currentStyle) {
            case 'classic':
                createClassicVu(leftVu, 'left');
                createClassicVu(rightVu, 'right');
                break;
            case 'led':
                createLedVu(leftVu, 'left');
                createLedVu(rightVu, 'right');
                break;
            case 'circular':
                createCircularVu(leftVu, 'left');
                createCircularVu(rightVu, 'right');
                break;
            case 'waveform':
                createWaveformVu(leftVu, 'left');
                createWaveformVu(rightVu, 'right');
                break;
            case 'spectrum':
                createSpectrumVu(leftVu, 'left');
                createSpectrumVu(rightVu, 'right');
                break;
            case 'retro':
                createRetroVu(leftVu, 'left');
                createRetroVu(rightVu, 'right');
                break;
        }
    }

    function createClassicVu(container, channel) {
        const level = document.createElement('div');
        level.className = 'vu-level';
        level.id = `${channel}-vu-level`;
        container.appendChild(level);
    }

    function createLedVu(container, channel) {
        const ledContainer = document.createElement('div');
        ledContainer.className = 'led-container';
        for (let i = 0; i < 20; i++) {
            const led = document.createElement('div');
            led.className = 'led-segment';
            led.dataset.index = i;
            ledContainer.appendChild(led);
        }
        container.appendChild(ledContainer);
    }

    function createCircularVu(container, channel) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '30');
        svg.setAttribute('height', '30');
        svg.setAttribute('viewBox', '0 0 34 34');
        svg.style.position = 'absolute';
        svg.style.top = '50%';
        svg.style.left = '50%';
        svg.style.transform = 'translate(-50%, -50%)';
        
        // Background circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '17');
        circle.setAttribute('cy', '17');
        circle.setAttribute('r', '13');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('opacity', '0.3');
        
        // Level circle
        const levelCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        levelCircle.setAttribute('cx', '17');
        levelCircle.setAttribute('cy', '17');
        levelCircle.setAttribute('r', '13');
        levelCircle.setAttribute('fill', 'none');
        levelCircle.setAttribute('stroke', '#00ff00');
        levelCircle.setAttribute('stroke-width', '4');
        levelCircle.setAttribute('stroke-linecap', 'round');
        levelCircle.setAttribute('stroke-dasharray', '81.68'); // 2 * π * 13
        levelCircle.setAttribute('stroke-dashoffset', '81.68');
        levelCircle.setAttribute('transform', 'rotate(-90 17 17)');
        levelCircle.id = `${channel}-circular-level`;
        levelCircle.className = 'circular-level';
        
        svg.appendChild(circle);
        svg.appendChild(levelCircle);
        container.appendChild(svg);
    }

    function createWaveformVu(container, channel) {
        const canvas = document.createElement('canvas');
        canvas.width = 60;
        canvas.height = 100;
        canvas.className = 'waveform-canvas';
        container.appendChild(canvas);
    }

    function createSpectrumVu(container, channel) {
        const spectrumContainer = document.createElement('div');
        spectrumContainer.className = 'spectrum-container';
        for (let i = 0; i < 16; i++) {
            const bar = document.createElement('div');
            bar.className = 'spectrum-bar';
            bar.dataset.index = i;
            spectrumContainer.appendChild(bar);
        }
        container.appendChild(spectrumContainer);
    }

    function createRetroVu(container, channel) {
        const retro = document.createElement('div');
        retro.className = 'retro-vu';
        
        const needle = document.createElement('div');
        needle.className = 'retro-needle';
        
        const scale = document.createElement('div');
        scale.className = 'retro-scale';
        scale.innerHTML = '0&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;40&nbsp;&nbsp;&nbsp;60&nbsp;&nbsp;&nbsp;80&nbsp;&nbsp;&nbsp;100';
        
        retro.appendChild(scale);
        retro.appendChild(needle);
        container.appendChild(retro);
    }

    function updateVUMeters() {
        if (!isPlaying) {
            resetVuMeters();
            state.animationFrameId = requestAnimationFrame(updateVUMeters);
            return;
        }

        analyserLeft.getByteTimeDomainData(dataArrayLeft);
        analyserRight.getByteTimeDomainData(dataArrayRight);
        analyserLeft.getByteFrequencyData(frequencyDataLeft);
        analyserRight.getByteFrequencyData(frequencyDataRight);

        // Calculate RMS levels
        const levelLeft = calculateRMSLevel(dataArrayLeft);
        const levelRight = calculateRMSLevel(dataArrayRight);

        const currentStyle = VU_STYLES[state.vuStyle];
        
        switch(currentStyle) {
            case 'classic':
                updateClassicVu(levelLeft, levelRight);
                break;
            case 'led':
                updateLedVu(levelLeft, levelRight);
                break;
            case 'circular':
                updateCircularVu(levelLeft, levelRight);
                break;
            case 'waveform':
                updateWaveformVu();
                break;
            case 'spectrum':
                updateSpectrumVu();
                break;
            case 'retro':
                updateRetroVu(levelLeft, levelRight);
                break;
        }

        state.animationFrameId = requestAnimationFrame(updateVUMeters);
    }

    function calculateRMSLevel(dataArray) {
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            const sample = (dataArray[i] - 128) / 128;
            sum += sample * sample;
        }
        return Math.min(Math.sqrt(sum / dataArray.length) * 300, 100);
    }

    function getLevelColor(level) {
        if (level < 60) return '#00ff00';
        if (level < 85) return '#ffff00';
        return '#ff0000';
    }

    function updateClassicVu(levelLeft, levelRight) {
        const leftLevel = document.getElementById('left-vu-level');
        const rightLevel = document.getElementById('right-vu-level');
        
        if (leftLevel) {
            leftLevel.style.height = `${levelLeft}%`;
            leftLevel.style.background = getLevelColor(levelLeft);
        }
        if (rightLevel) {
            rightLevel.style.height = `${levelRight}%`;
            rightLevel.style.background = getLevelColor(levelRight);
        }
    }

    function updateLedVu(levelLeft, levelRight) {
        updateLedChannel(leftVu, levelLeft);
        updateLedChannel(rightVu, levelRight);
    }

    function updateLedChannel(container, level) {
        const leds = container.querySelectorAll('.led-segment');
        const activeLeds = Math.floor((level / 100) * leds.length);
        
        leds.forEach((led, index) => {
            if (index < activeLeds) {
                const ratio = index / leds.length;
                if (ratio < 0.6) led.style.background = '#00ff00';
                else if (ratio < 0.85) led.style.background = '#ffff00';
                else led.style.background = '#ff0000';
                led.style.opacity = '1';
            } else {
                led.style.opacity = '0.1';
            }
        });
    }

    function updateCircularVu(levelLeft, levelRight) {
        const leftCircle = document.getElementById('left-circular-level');
        const rightCircle = document.getElementById('right-circular-level');
        
        if (leftCircle) {
            const circumference = 81.68; // 2 * π * 13
            const offset = circumference - (levelLeft / 100) * circumference;
            leftCircle.setAttribute('stroke-dashoffset', offset);
            leftCircle.setAttribute('stroke', getLevelColor(levelLeft));
        }
        
        if (rightCircle) {
            const circumference = 81.68; // 2 * π * 13
            const offset = circumference - (levelRight / 100) * circumference;
            rightCircle.setAttribute('stroke-dashoffset', offset);
            rightCircle.setAttribute('stroke', getLevelColor(levelRight));
        }
    }

    function updateWaveformVu() {
        updateWaveformChannel(leftVu, dataArrayLeft);
        updateWaveformChannel(rightVu, dataArrayRight);
    }

    function updateWaveformChannel(container, dataArray) {
        const canvas = container.querySelector('.waveform-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--console-bg');
        ctx.fillRect(0, 0, width, height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        
        // Draw waveform vertically
        const sliceHeight = height / dataArray.length;
        let y = 0;
        
        for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            const x = (v * width / 2) + width / 2;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            y += sliceHeight;
        }
        
        ctx.stroke();
    }

    function updateSpectrumVu() {
        updateSpectrumChannel(leftVu, frequencyDataLeft);
        updateSpectrumChannel(rightVu, frequencyDataRight);
    }

    function updateSpectrumChannel(container, frequencyData) {
        const bars = container.querySelectorAll('.spectrum-bar');
        const barWidth = Math.floor(frequencyData.length / bars.length);
        
        bars.forEach((bar, index) => {
            let sum = 0;
            const start = index * barWidth;
            for (let i = start; i < start + barWidth; i++) {
                sum += frequencyData[i];
            }
            const average = sum / barWidth;
            const height = (average / 255) * 100;
            
            bar.style.height = `${height}%`;
            bar.style.background = getLevelColor(height * 1.5);
        });
    }

    function updateRetroVu(levelLeft, levelRight) {
        updateRetroChannel(leftVu, levelLeft);
        updateRetroChannel(rightVu, levelRight);
    }

    function updateRetroChannel(container, level) {
        const needle = container.querySelector('.retro-needle');
        if (needle) {
            const rotation = -45 + (level / 100) * 90;
            needle.style.transform = `rotate(${rotation}deg)`;
            needle.style.borderColor = getLevelColor(level);
        }
    }

    function resetVuMeters() {
        const currentStyle = VU_STYLES[state.vuStyle];
        
        switch(currentStyle) {
            case 'classic':
                const leftLevel = document.getElementById('left-vu-level');
                const rightLevel = document.getElementById('right-vu-level');
                if (leftLevel) {
                    leftLevel.style.height = '0%';
                    leftLevel.style.background = '#00ff00';
                }
                if (rightLevel) {
                    rightLevel.style.height = '0%';
                    rightLevel.style.background = '#00ff00';
                }
                break;
            case 'led':
                document.querySelectorAll('.led-segment').forEach(led => {
                    led.style.opacity = '0.1';
                });
                break;
            case 'circular':
                const leftCircleReset = document.getElementById('left-circular-level');
                const rightCircleReset = document.getElementById('right-circular-level');
                if (leftCircleReset) {
                    leftCircleReset.setAttribute('stroke-dashoffset', '81.68');
                    leftCircleReset.setAttribute('stroke', '#00ff00');
                }
                if (rightCircleReset) {
                    rightCircleReset.setAttribute('stroke-dashoffset', '81.68');
                    rightCircleReset.setAttribute('stroke', '#00ff00');
                }
                break;
            case 'retro':
                document.querySelectorAll('.retro-needle').forEach(needle => {
                    needle.style.transform = 'rotate(-45deg)';
                    needle.style.borderColor = '#00ff00';
                });
                break;
        }
    }

    function updateNowPlaying() {
        const stationName = stationSelect.options[stationSelect.selectedIndex].text;
        nowPlaying.textContent = `Now Playing: ${stationName}`;
        state.currentStation = stationSelect.value;
    }

    // Event Listeners
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.textContent = 'Play';
        } else {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
            playPauseBtn.textContent = 'Pause';
        }
        isPlaying = !isPlaying;
        state.isPlaying = isPlaying;
        updateNowPlaying();
    });

    stationSelect.addEventListener('change', () => {
        audio.src = stationSelect.value;
        state.currentStation = stationSelect.value;
        updateNowPlaying();
        if (isPlaying) {
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
        }
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        state.volume = audio.volume;
    });

    popoutBtn.addEventListener('click', () => {
        if (state.popoutWindow && !state.popoutWindow.closed) {
            state.popoutWindow.focus();
            return;
        }

        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            state.isPlaying = false;
            playPauseBtn.textContent = 'Play';
        }

        const currentTheme = document.documentElement.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
        const popoutUrl = `tools/radiostream-player/popout.html?station=${encodeURIComponent(stationSelect.value)}&theme=${currentTheme}`;
        state.popoutWindow = window.open(popoutUrl, 'RadioStreamPopout', 'width=300,height=278');
    });

    window.addEventListener('message', (event) => {
        if (event.data.type === 'popoutClosed') {
            state.popoutWindow = null;
            if (state.isPlaying) {
                audio.play().catch(err => {
                    console.error('Playback failed:', err);
                    nowPlaying.textContent = 'Error: Unable to play stream';
                });
                isPlaying = true;
                playPauseBtn.textContent = 'Pause';
            }
        }
    });

    // Start the visualization
    updateVUMeters();
    updateNowPlaying();

    // Cleanup
    window.addEventListener('beforeunload', cleanup);
    document.addEventListener('toolUnload', cleanup);

    function cleanup() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            state.isPlaying = false;
            playPauseBtn.textContent = 'Play';
        }
        if (state.animationFrameId) {
            cancelAnimationFrame(state.animationFrameId);
            state.animationFrameId = null;
        }
    }
}

if (document.getElementById('station-select')) {
    initRadioStreamPlayer();
}
