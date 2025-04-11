// Scripts for AR.js

// TO DO: Make the model clickable (once it loads)
window.addEventListener('DOMContentLoaded', () => {
    const plate = document.querySelector("#gbPlate");
    plate.addEventListener('model-loaded', () => { // Wait for the model to load
        plate.addEventListener('click', () => {
            alert("You clicked the plate!");
        });
    });
});
// TO DO: Add some animation to the model
// TO DO: Add a popup with information about the model
// TO DO: Add a button to get an external link to the restaurant's site
// TO DO: Add music and/or sounds to the experience to make it more immersive