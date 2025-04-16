// Scripts for AR.js

// Make the model clickable (once it loads)
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    let isSpinning = false;

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {

            // Add a popup with information about the model
            message.style.display = 'block';

            // hide after 3 seconds
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

            if (!isSpinning) {
                // Add some animation to the model (toggled by click)
                plate.setAttribute('animation', {
                    property: 'rotation',
                    to: '0 90 0',
                    dur: 6000, // 6 seconds
                    easing: 'linear',
                    loop: true
                });
                isSpinning = true;
            } else {
                // Stop spinning
                plate.removeAttribute('animation');
                isSpinning = false;

                // reset rotation
                plate.setAttribute('rotation', '-90 0 0');
            }
            
            // TO DO: Add some information about the ingredients in the dish
        });
    });
});

// TO DO: Add a button to get an external link to the restaurant's site
// TO DO: Add music and/or sounds to the experience to make it more immersive