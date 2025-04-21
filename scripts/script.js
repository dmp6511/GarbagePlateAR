window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    const videoPopup = document.querySelector('#videoPopup');
    const videoFrame = document.querySelector('#gbVideo');
    const closeBtn = document.querySelector('#closeVideoBtn');

    let isSpinning = false;
    let isVideoOpen = false; // Prevent spam

    // YouTube snippet: 35s to 50s, show full frame
    const snippetUrl = "https://www.youtube.com/embed/bIY95EJczgM?start=35&end=50&autoplay=1&controls=1&modestbranding=1&rel=0";

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {
            if (isVideoOpen) return;
            isVideoOpen = true;

            // Show message
            message.style.display = 'block';

            // Load and show video
            videoFrame.src = snippetUrl;
            videoPopup.style.display = 'block';

            // Hide text after 3s
            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

            // Toggle model animation
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

    closeBtn.addEventListener('click', () => {
        videoPopup.style.display = 'none';
        videoFrame.src = ''; // ⛔️ stop video
        isVideoOpen = false; // ✅ allow future clicks
    });
});
