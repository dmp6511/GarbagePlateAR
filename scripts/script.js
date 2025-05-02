
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector('#gbPlate');
    const message = document.querySelector('#message');
    const videoPopup = document.querySelector('#videoPopup');
    const video = document.querySelector('#gbVideo');
    const closeBtn = document.querySelector('#closeVideoBtn');
    const fullscreenBtn = document.querySelector('#fullscreenBtn');

    let isSpinning = false;
    let isVideoOpen = false;

    plate.addEventListener('model-loaded', () => {
        plate.addEventListener('click', () => {
            if (isVideoOpen) return;
            isVideoOpen = true;

            message.style.display = 'block';
            videoPopup.style.display = 'block';
            video.currentTime = 0;
            video.play();

            showNextFact(); // Start showing facts

            setTimeout(() => {
                message.style.display = 'none';
            }, 3000);

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
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isVideoOpen = false;
    });

    fullscreenBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        } else {
            alert("Fullscreen not supported.");
        }
    });
});


const factsBox = document.getElementById('factsBox');
const factText = document.getElementById('factText');

// Placeholder facts array
const facts = [
  "The Garbage Plate was created by Nick Tahou Hots in Rochester, NY.",
  "It traditionally includes a mix of home fries, mac salad, meat, and hot sauce.",
  "The name 'Garbage Plate' came from college students asking for 'one of those garbage plates.'",
  "Garbage Plates are a staple for late-night eats and Rochester food culture."
];

let currentFact = 0;

// Show rotating facts (optional timed loop)
function showNextFact() {
  factText.textContent = facts[currentFact];
  factsBox.style.display = 'block';

  currentFact = (currentFact + 1) % facts.length;

  // Automatically cycle to the next fact every 6 seconds
  setTimeout(() => {
    if (factsBox.style.display === 'block') showNextFact();
  }, 6000);
}
