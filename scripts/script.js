AFRAME.registerComponent('gesture-handler', {
    schema: {
        enabled: { default: true },
        resetDelay: { default: 2000 }
    },
    init: function () {
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
    remove: function () {
        this.el.removeEventListener('onefingermove', this.handleRotation);
        this.el.removeEventListener('twofingermove', this.handleScale);
        this.el.removeEventListener('touchend', this.scheduleReset);
    },
    handleRotation: function (event) {
        const rotation = this.el.getAttribute('rotation');
        this.el.setAttribute('rotation', {
            x: rotation.x,
            y: rotation.y + event.detail.positionChange.x * 2,
            z: rotation.z
        });
    },
    handleScale: function (event) {
        const scale = this.el.getAttribute('scale');
        const delta = event.detail.spreadChange / 200;
        this.el.setAttribute('scale', {
            x: scale.x + delta,
            y: scale.y + delta,
            z: scale.z + delta
        });
    },
    scheduleReset: function () {
        clearTimeout(this.resetTimeout);
        this.resetTimeout = setTimeout(() => {
            this.el.setAttribute('rotation', this.initialRotation);
            this.el.setAttribute('scale', this.initialScale);
        }, this.data.resetDelay);
    }
});

function addText(content, position = { x: 0, y: 0.5, z: -1 }) {
    const container = document.querySelector('#text-container');
    const textEl = document.createElement('a-text');
    textEl.setAttribute('value', content);
    textEl.setAttribute('color', '#222');
    textEl.setAttribute('align', 'center');
    textEl.setAttribute('width', 2);
    textEl.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    textEl.setAttribute('side', 'double');
    textEl.setAttribute('shader', 'msdf');
    textEl.setAttribute('font', 'https://cdn.aframe.io/fonts/Roboto-msdf.json');
    container.appendChild(textEl);
}

window.addEventListener('DOMContentLoaded', () => {
    // Initial AR text labels
    addText("Garbage Plate", { x: 0, y: 3.5, z: 0.8 });
    addText("A Rochester, NY classic", { x: 0, y: 2.7, z: 0.8 });
    addText("Meat, mac salad, fries & more", { x: 0, y: 2.4, z: 0.8 });

    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');

    // Optional: keep if using popup video again
    const videoPopup = document.querySelector('#videoPopup');
    const videoElement = document.querySelector('#gbVideo');
    const closeBtn = document.querySelector('#closeVideoBtn');

    let isSpinning = false;
    let isVideoOpen = false;

    plate.addEventListener('model-loaded', () => {
        // Add extra label after model loads
        addText("Meat, mac salad, fries & more!!", { x: 0, y: 1.4, z: 0 });

        plate.addEventListener('click', () => {
            if (isVideoOpen) return;
            isVideoOpen = true;

            message.style.display = 'block';
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);



            // Toggle rotation
            if (!isSpinning) {
                plate.setAttribute('animation', {
                    property: 'rotation',
                    to: '0 90 0',
                    dur: 8000,
                    easing: 'linear',
                    loop: true
                });
                isSpinning = true;
            } else {
                plate.removeAttribute('animation');
                isSpinning = false;
                plate.setAttribute('rotation', '0 -90 0');
            }

            document.querySelector('#gbMac').setAttribute('visible', 'true');
            document.querySelector('#gbBurg').setAttribute('visible', 'true');
            document.querySelector('#gbFries').setAttribute('visible', 'true');

            // show labels
            document.querySelector('#labelMac').setAttribute('visible', 'true');
            document.querySelector('#labelBurg').setAttribute('visible', 'true');
            document.querySelector('#labelFries').setAttribute('visible', 'true');
        });
    });
});
