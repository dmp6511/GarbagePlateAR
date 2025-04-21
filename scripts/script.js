// Scripts for AR.js

// Make the model clickable (once it loads)
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    const videoPopup = document.querySelector('#videoPopup');
    const videoFrame = document.querySelector('#gbVideo');
    const closeBtn = document.querySelector('#closeVideoBtn');
    let isSpinning = false;

    // YouTube snippet: Alex Tahou - play from 35s to 50s
    const snippetUrl = "https://www.youtube.com/embed/bIY95EJczgM?start=35&end=50&autoplay=1&controls=1";

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {
            // Show text message
            message.style.display = 'block';

            // Load video + show popup
            videoFrame.src = snippetUrl;
            videoPopup.style.display = 'block';

            // Hide message after 3 seconds
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

            // Toggle rotation
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

    // Close button stops video + hides popup
    closeBtn.addEventListener('click', () => {
        videoPopup.style.display = 'none';
        videoFrame.src = ''; // clear the src to stop playback/audio
    });
});
