
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    const videoPopup = document.querySelector('#videoPopup');
    const videoElement = document.querySelector('#gbVideo'); // video
    const closeBtn = document.querySelector('#closeVideoBtn');

    let isSpinning = false;
    let isVideoOpen = false; // Prevent spam

    // Self-hosted video configuration
    const videoSourceUrl = "assets/GBExplain.mp4";

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {
            if (isVideoOpen) return;
            isVideoOpen = true;

            // Show message
            message.style.display = 'block';

            // Load and play self-hosted video
            videoElement.src = videoSourceUrl;
            videoElement.style.display = 'block'; // Ensure it's visible
            videoPopup.style.display = 'block';
            videoElement.play(); // Start playing the video

            // Hide text after 3s
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

            // Toggle model animation
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
        });
    });

    closeBtn.addEventListener('click', () => {
        videoPopup.style.display = 'none';
        videoElement.pause(); // Ensure video stops playing when closed
        videoElement.src = ''; // Clean up the video source
        isVideoOpen = false;
    });
});
