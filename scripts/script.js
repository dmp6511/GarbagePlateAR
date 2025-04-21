// Scripts for AR.js

// Make the model clickable (once it loads)
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    const videoPopup = document.querySelector('#videoPopup'); // Video of Alex Tahou explaining the dish
    let isSpinning = false;

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {

            // Show the popup message
            message.style.display = 'block';

            // Show the video popup
            videoPopup.style.display = 'block';

            // Hide both after a set time
            setTimeout(() => {
                message.style.display = 'none';
                videoPopup.style.display = 'none';
            }, 30000); // 30 seconds

            // Toggle spinning
            if (!isSpinning) {
                plate.setAttribute('animation', {
                    property: 'rotation',
                    to: '0 90 0',
                    dur: 6000,
                    easing: 'linear',
                    loop: true
                });
                isSpinning = true;
            } else {
                plate.removeAttribute('animation');
                isSpinning = false;
                plate.setAttribute('rotation', '0 -90 0');
            }

            
        });
    });
});

// TO DO: Add a button to get an external link to the restaurant's site
// TO DO: Add music and/or sounds to the experience to make it more immersive
