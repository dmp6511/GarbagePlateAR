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
    /* DOM refs */
    const plate = document.getElementById('gbPlate');
    const msgBox = document.getElementById('message');
    const startBtn = document.getElementById('startBtn');
    const introOverlay = document.getElementById('introOverlay');
    const introAudio = document.getElementById('introAudio');

    const labels = {
        mac: document.getElementById('labelMac'),
        burg: document.getElementById('labelBurg'),
        fries: document.getElementById('labelFries')
    };

    const models = {
        mac: document.getElementById('gbMac'),
        burg: document.getElementById('gbBurg'),
        fries: document.getElementById('gbFries')
    };

    /* ---------- Intro overlay ---------- */
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            /* hide overlay */
            if (introOverlay) introOverlay.style.display = 'none';

            /* play music (user‑gesture) */
            if (introAudio) {
                introAudio.currentTime = 0;
                introAudio.play().catch(err => console.warn('Intro audio blocked:', err));
            }
        });
    }

    /* ---------- Plate interaction ---------- */
    let spinning = false;
    let activated = false;

    plate.addEventListener('model-loaded', () => {
        /* display helper text once model is ready */
        addText('Tap the plate to explore!', { x: 0, y: 1.4, z: 0 });

        plate.addEventListener('click', () => {
            if (activated) return;
            activated = true;

            /* toast message */
            msgBox.style.display = 'block';
            setTimeout(() => (msgBox.style.display = 'none'), 3000);

            /* start spin animation */
            if (!spinning) {
                plate.setAttribute('animation', {
                    property: 'rotation',
                    to: '0 90 0',
                    dur: 8000,
                    easing: 'linear',
                    loop: true
                });
                spinning = true;
            }

            /* show all ingredient meshes + labels */
            Object.values(models).forEach(m => m.setAttribute('visible', 'true'));
            Object.values(labels).forEach(l => l.setAttribute('visible', 'true'));
        });
    });

    /* ---------- Ingredient click events ---------- */
    models.mac.addEventListener('click', () => {
        showInfo(
            'Macaroni Salad\nA creamy, tangy side that cools the plate.\n' +
            'Ingredients: Macaroni, mayo, mustard, celery, onion, spices.'
        );
    });

    models.burg.addEventListener('click', () => {
        showInfo(
            'Hamburger Patty\nJuicy beef grilled to perfection.\n' +
            'Ingredients: Ground beef, seasoning.'
        );
    });

    models.fries.addEventListener('click', () => {
        showInfo(
            'French Fries\nCrispy golden potatoes with a dash of salt.\n' +
            'Ingredients: Potatoes, oil, salt.'
        );
    });

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
