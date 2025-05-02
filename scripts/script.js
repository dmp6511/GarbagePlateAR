/* scripts/script.js – Garbage Plate AR logic (May 2025) */

/* ────────────────────────────
   Utility helpers
──────────────────────────── */
function addText(value, position) {
    const parent = document.querySelector('#text-container');
    if (!parent) return;

    const t = document.createElement('a-text');
    t.setAttribute('value', value);
    t.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    t.setAttribute('color', '#fff');
    t.setAttribute('align', 'center');
    t.setAttribute('width', 2);
    t.setAttribute('side', 'double');
    t.setAttribute('look-at', '[camera]');
    t.setAttribute('shader', 'msdf');
    t.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
    parent.appendChild(t);
}

function showInfo(msg) {
    const panel = document.querySelector('#infoPanel');
    const text = document.querySelector('#infoText');
    if (!panel || !text) return;

    text.setAttribute('value', msg);
    panel.setAttribute('visible', 'true');
}

function hideInfo() {
    const panel = document.querySelector('#infoPanel');
    if (panel) panel.setAttribute('visible', 'false');
}

/* ────────────────────────────
   Main runtime
──────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startBtn');
    const introOverlay = document.getElementById('introOverlay');
    const message = document.getElementById('message');
    const infoPanel = document.getElementById('infoPanel');
    const infoText = document.getElementById('infoText');
    const audioElement = document.querySelector('audio');

    // Ingredient elements
    const gbMac = document.getElementById('gbMac');
    const gbBurg = document.getElementById('gbBurg');
    const gbFries = document.getElementById('gbFries');
    const labelMac = document.getElementById('labelMac');
    const labelBurg = document.getElementById('labelBurg');
    const labelFries = document.getElementById('labelFries');

    // Start button click handler
    startBtn.addEventListener('click', () => {
        // Hide intro overlay
        introOverlay.style.display = 'none';

        // Play background music
        playBackgroundMusic();

        // Show message about ingredients
        setTimeout(() => {
            message.style.display = 'block';

            // Show ingredients after a delay
            setTimeout(() => {
                gbMac.setAttribute('visible', 'true');
                gbBurg.setAttribute('visible', 'true');
                gbFries.setAttribute('visible', 'true');
                labelMac.setAttribute('visible', 'true');
                labelBurg.setAttribute('visible', 'true');
                labelFries.setAttribute('visible', 'true');
            }, 1000);

            // Hide message after 5 seconds
            setTimeout(() => {
                message.style.display = 'none';
            }, 5000);
        }, 500);
    });

    // Function to play background music
    function playBackgroundMusic() {
        // Some browsers require user interaction before playing audio
        audioElement.volume = 0.5; // Set volume to 50%
        audioElement.loop = true; // Loop the audio

        // Play the audio and handle any errors
        const playPromise = audioElement.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio playback failed: ", error);
                // Create a play button if autoplay fails
                createAudioPlayButton();
            });
        }
    }

    // Create a play button if autoplay fails due to browser restrictions
    function createAudioPlayButton() {
        const audioBtn = document.createElement('button');
        audioBtn.textContent = '🔊 Play Music';
        audioBtn.style.position = 'absolute';
        audioBtn.style.top = '10px';
        audioBtn.style.right = '10px';
        audioBtn.style.padding = '8px 12px';
        audioBtn.style.background = '#ff4500';
        audioBtn.style.color = 'white';
        audioBtn.style.border = 'none';
        audioBtn.style.borderRadius = '4px';
        audioBtn.style.zIndex = '1000';
        audioBtn.style.cursor = 'pointer';

        audioBtn.addEventListener('click', () => {
            audioElement.play();
            audioBtn.style.display = 'none';
        });

        document.body.appendChild(audioBtn);
    }

    // Event listeners for ingredients
    gbMac.addEventListener('click', () => {
        showInfo("Mac Salad: A creamy, cold macaroni salad that adds a refreshing contrast to the hot components.");
    });

    gbBurg.addEventListener('click', () => {
        showInfo("Burger: Grilled to perfection, the burger patty adds a savory, meaty component to the plate.");
    });

    gbFries.addEventListener('click', () => {
        showInfo("Fries: Crispy home fries are a staple of the Garbage Plate, adding texture and soaking up the sauce.");
    });

    // Show info panel with text
    function showInfo(text) {
        infoText.setAttribute('value', text);
        infoPanel.setAttribute('visible', 'true');

        // Hide info panel after 4 seconds
        setTimeout(() => {
            infoPanel.setAttribute('visible', 'false');
        }, 4000);
    }
    setTimeout(() => {
        infoPanel.setAttribute('visible', 'false');
    }, 4000);

    /* hide info panel when tapping elsewhere */
    document.querySelector('a-scene').addEventListener('touchstart', hideInfo);
});





/* ────────────────────────────
   Gesture‑handler component
──────────────────────────── */
AFRAME.registerComponent('gesture-handler', {
    schema: { enabled: { default: true }, resetDelay: { default: 2000 } },

    init() {
        this.initialRotation = this.el.getAttribute('rotation');
        this.initialScale = this.el.getAttribute('scale');
        this.resetTimeout = null;

        this.handleRotation = this.handleRotation.bind(this);
        this.handleScale = this.handleScale.bind(this);
        this.scheduleReset = this.scheduleReset.bind(this);

        this.el.addEventListener('onefingermove', this.handleRotation);
        this.el.addEventListener('twofingermove', this.handleScale);
        this.el.addEventListener('touchend', this.scheduleReset);
    },

    remove() {
        this.el.removeEventListener('onefingermove', this.handleRotation);
        this.el.removeEventListener('twofingermove', this.handleScale);
        this.el.removeEventListener('touchend', this.scheduleReset);
    },

    handleRotation(e) {
        const rot = this.el.getAttribute('rotation');
        this.el.setAttribute('rotation', {
            x: rot.x,
            y: rot.y + e.detail.positionChange.x * 2,
            z: rot.z
        });
    },

    handleScale(e) {
        const s = this.el.getAttribute('scale');
        const d = e.detail.spreadChange / 200;
        this.el.setAttribute('scale', {
            x: s.x + d,
            y: s.y + d,
            z: s.z + d
        });
    },

    scheduleReset() {
        clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => {
            this.el.setAttribute('rotation', this.initialRotation);
            this.el.setAttribute('scale', this.initialScale);
        }, this.data.resetDelay);
    }
});
