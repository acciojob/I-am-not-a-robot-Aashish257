//your code here
// script.js

// Image URLs (5 unique)
const imagePool = [
  "https://picsum.photos/id/237/200/300",            // img1
  "https://picsum.photos/seed/picsum/200/300",       // img2
  "https://picsum.photos/200/300?grayscale",         // img3
  "https://picsum.photos/200/300/?random=4",         // img4
  "https://picsum.photos/200/300.jpg"                // img5
];

const grid = document.getElementById("grid");
const heading = document.getElementById("h");
const para = document.getElementById("para");
const resetBtn = document.getElementById("reset");
const verifyBtn = document.getElementById("verify");

// state: store selected tile elements (unique tiles only)
let selectedTiles = []; // array of DOM elements

// Utility: Fisher-Yates shuffle
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Build the 6-tile array: pick one image to duplicate, then shuffle
function buildTiles() {
  // pick random index to duplicate
  const duplicateIndex = Math.floor(Math.random() * imagePool.length);
  const chosen = [...imagePool]; // copy
  // remove nothing; instead we'll construct final array: 5 originals + 1 duplicate of chosen
  const tiles = [...chosen];
  tiles.push(chosen[duplicateIndex]); // duplicate one randomly chosen image
  return shuffle(tiles);
}

// Render tiles to DOM
function render() {
  grid.innerHTML = "";
  para.innerText = "";
  verifyBtn.style.display = "none";
  resetBtn.style.display = "none";
  selectedTiles = [];

  heading.innerText = "Please click on the identical tiles to verify that you are not a robot.";

  const tiles = buildTiles(); // array of 6 URLs (one duplicate)
  tiles.forEach((url, index) => {
    const img = document.createElement("img");
    img.className = "tile";
    img.src = url;
    // data-key represents image identity (URL string works)
    img.dataset.key = url;
    img.dataset.index = index;
    img.alt = "tile " + index;
    img.addEventListener("click", tileClickHandler);
    grid.appendChild(img);
  });
}

// Click handler for each tile
function tileClickHandler(e) {
  const tile = e.currentTarget;

  // If result message is present (after verification) and user clicks, we allow actions:
  // We support toggling: clicking a selected tile deselects it.
  if (tile.classList.contains("selected")) {
    // deselect
    tile.classList.remove("selected");
    selectedTiles = selectedTiles.filter(t => t !== tile);
  } else {
    // select
    selectedTiles.push(tile);
    tile.classList.add("selected");
  }

  updateButtonsAndState();
}

// Show/hide buttons according to number of unique selected tiles
function updateButtonsAndState() {
  // Reset button should appear when at least one tile is selected
  if (selectedTiles.length > 0) {
    resetBtn.style.display = "inline-block";
  } else {
    resetBtn.style.display = "none";
  }

  // Verify button appears only when exactly 2 tiles are selected
  if (selectedTiles.length === 2) {
    verifyBtn.style.display = "inline-block";
  } else {
    verifyBtn.style.display = "none";
  }

  // If more than 2 tiles selected, verify remains hidden (require exactly 2)
  // Message area is cleared until verify is pressed
  para.innerText = "";
}

// Reset behavior: clear selections and reset to initial state
resetBtn.addEventListener("click", () => {
  // clear selected visuals
  selectedTiles.forEach(t => t.classList.remove("selected"));
  selectedTiles = [];
  verifyBtn.style.display = "none";
  resetBtn.style.display = "none";
  para.innerText = "";
  heading.innerText = "Please click on the identical tiles to verify that you are not a robot.";
});

// Verify behavior
verifyBtn.addEventListener("click", () => {
  // Ensure exactly two are selected (button only shows for exactly 2)
  if (selectedTiles.length !== 2) {
    // defensive: hide verify if not exactly two
    verifyBtn.style.display = "none";
    return;
  }

  // Compare the dataset keys (URLs). If equal => match.
  const a = selectedTiles[0].dataset.key;
  const b = selectedTiles[1].dataset.key;

  if (a === b) {
    para.innerText = "You are a human. Congratulations!";
  } else {
    para.innerText = "We can't verify you as a human. You selected the non-identical tiles.";
  }

  // After clicking Verify the Verify button disappears (require reset to try again)
  verifyBtn.style.display = "none";
});

// initial render on load
render();


