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
    vuStyle: 'bar' // Track current VU meter style
};

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
    const leftVuLevel = document.getElementById('left-vu-level');
    const rightVuLevel = document.getElementById('right-vu-level');
    const vuStyleBtn = document.getElementById('vu-style-btn');

    if (!audio) {
        audio = new Audio();
        audio.crossOrigin = 'anonymous';
        state.audio = audio;

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audio);
        splitter = audioContext.createChannelSplitter(2);
        analyserLeft = audioContext.createAnalyser();
        analyserRight = audioContext.createAnalyser();
        analyserLeft.fftSize = 256;
        analyserRight.fftSize = 256;

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

    let isPlaying = state.isPlaying;
    let currentStation = state.currentStation;

    function updateVUMeters() {
        analyserLeft.getByteFrequencyData(dataArrayLeft);
        analyserRight.getByteFrequencyData(dataArrayRight);

        const leftLevel = Math.max(...dataArrayLeft) / 255;
        const rightLevel = Math.max(...dataArrayRight) / 255;

        if (state.vuStyle === 'bar') {
            leftVuLevel.style.height = `${leftLevel * 100}%`;
            rightVuLevel.style.height = `${rightLevel * 100}%`;
            leftVuLevel.style.background = leftLevel > 0.7 ? 'red' : leftLevel > 0.4 ? 'yellow' : 'green';
            rightVuLevel.style.background = rightLevel > 0.7 ? 'red' : rightLevel > 0.4 ? 'yellow' : 'green';
        } else if (state.vuStyle === 'wave') {
            leftVuLevel.style.transform = `translateY(${((1 - leftLevel) * 100)}%)`;
            rightVuLevel.style.transform = `translateY(${((1 - rightLevel) * 100)}%)`;
        } else if (state.vuStyle === 'circle') {
            leftVuLevel.style.transform = `translate(-50%, -50%) scale(${leftLevel})`;
            rightVuLevel.style.transform = `translate(-50%, -50%) scale(${rightLevel})`;
        }

        state.animationFrameId = requestAnimationFrame(updateVUMeters);
    }

    function updateNowPlaying() {
        const stationName = stationSelect.options[stationSelect.selectedIndex].text;
        nowPlaying.textContent = `Now Playing: ${stationName}`;
        state.currentStation = stationSelect.value;
    }

    // Cycle VU meter styles
    vuStyleBtn.addEventListener('click', () => {
        const styles = ['bar', 'wave', 'circle'];
        const currentIndex = styles.indexOf(state.vuStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        state.vuStyle = styles[nextIndex];
        leftVuLevel.parentElement.className = `vu-meter ${state.vuStyle}`;
        rightVuLevel.parentElement.className = `vu-meter ${state.vuStyle}`;
        console.log(`Switched to VU style: ${state.vuStyle}`);
    });

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.textContent = 'Play';
            cancelAnimationFrame(state.animationFrameId);
            state.animationFrameId = null;
        } else {
            audio.src = stationSelect.value;
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
            playPauseBtn.textContent = 'Pause';
            if (!state.animationFrameId) {
                updateVUMeters();
            }
        }
        isPlaying = !isPlaying;
        state.isPlaying = isPlaying;
    });

    stationSelect.addEventListener('change', () => {
        if (isPlaying) {
            audio.src = stationSelect.value;
            audio.play().catch(err => {
                console.error('Playback failed:', err);
                nowPlaying.textContent = 'Error: Unable to play stream';
            });
        }
        updateNowPlaying();
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
        state.popoutWindow = window.open(popoutUrl, 'RadioStreamPopout', 'width=300,height=250');
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

    // Initialize with current state
    if (state.currentStation) {
        stationSelect.value = state.currentStation;
    }
    volumeSlider.value = state.volume;
    audio.volume = state.volume;
    updateNowPlaying();
    if (isPlaying) {
        playPauseBtn.textContent = 'Pause';
        updateVUMeters();
    }
}

if (document.getElementById('station-select')) {
    initRadioStreamPlayer();
}
