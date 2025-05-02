
function addText(value, position) {
    const parent = document.querySelector('#text-container');
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

function showSidebar(msg) {
    document.getElementById('sidebarText').textContent = msg;
    document.getElementById('sidebar').style.right = '0px';
}

function hideSidebar() {
    document.getElementById('sidebar').style.right = '-260px';
}


window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const msgBox = document.querySelector('#message');
    const startBtn = document.querySelector('#startBtn');
    const audioElement = document.querySelector('#audioElement');
    const introOverlay = document.querySelector('#introOverlay');

    /* label + model entities */
    const labels = {
        mac: document.querySelector('#labelMac'),
        burg: document.querySelector('#labelBurg'),
        fries: document.querySelector('#labelFries')
    };
    const models = {
        mac: document.querySelector('#gbMac'),
        burg: document.querySelector('#gbBurg'),
        fries: document.querySelector('#gbFries')
    };

    let spinning = false;
    let activated = false;          // ensure plate tap logic runs once

    startBtn.addEventListener('click', () => {
        /* hide start button */
        introOverlay.style.display = 'none';

        // play audio
        audioElement.play().catch(err => {
            console.error('Error playing audio:', err);

        });
        audioElement.volume = 0.5; // Set volume to 50%
        audioElement.loop = true; // Loop the audio
    });

    /* ── plate loaded ────────────────────── */
    plate.addEventListener('model-loaded', () => {
        addText('Tap the plate to explore!', { x: 0, y: 1.4, z: 0 });
    });


    plate.addEventListener('click', () => {
        if (activated) return;
        activated = true;

        /* brief toast */
        msgBox.style.display = 'block';
        setTimeout(() => (msgBox.style.display = 'none'), 3000);

        /* spin toggle */
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

        /* reveal ingredients + labels */
        ['mac', 'burg', 'fries'].forEach(key => {
            models[key].setAttribute('visible', 'true');
            labels[key].setAttribute('visible', 'true');
        });
    });

});
/* ── label click handlers ─────────────── */
models.mac.addEventListener('click', () => showSidebar("Mac Salad: A creamy cold pasta side dish that's a Garbage Plate staple."));
models.burg.addEventListener('click', () => showSidebar("Cheeseburger Patty: A grilled ground beef patty, one of the most popular meat options."));
models.fries.addEventListener('click', () => showSidebar("French Fries: Crispy and golden, they form the base of a traditional Garbage Plate."));



// gesture-handler.js
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
        this.el.setAttribute('rotation', { x: rot.x, y: rot.y + e.detail.positionChange.x * 2, z: rot.z });
    },

    handleScale(e) {
        const s = this.el.getAttribute('scale');
        const d = e.detail.spreadChange / 200;
        this.el.setAttribute('scale', { x: s.x + d, y: s.y + d, z: s.z + d });
    },

    scheduleReset() {
        clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => {
            this.el.setAttribute('rotation', this.initialRotation);
            this.el.setAttribute('scale', this.initialScale);
        }, this.data.resetDelay);
    }
});
