//your code here
// script.js (simple, test-friendly)
// Uses only basic DOM features. Each img gets an identity class .img1 ... .img5
// so Cypress tests that query .img1, .img2 ... will find them.

// list of image objects with class name + url
var images = [
  { cls: "img1", url: "https://picsum.photos/id/237/200/300" },
  { cls: "img2", url: "https://picsum.photos/seed/picsum/200/300" },
  { cls: "img3", url: "https://picsum.photos/200/300?grayscale" },
  { cls: "img4", url: "https://picsum.photos/200/300/?random=4" },
  { cls: "img5", url: "https://picsum.photos/200/300.jpg" }
];

var grid = document.getElementById("grid");
var heading = document.getElementById("h");
var para = document.getElementById("para");
var resetBtn = document.getElementById("reset");
var verifyBtn = document.getElementById("verify");

var selected = [];

// Make a tiles array: 5 unique + 1 duplicate chosen randomly, then shuffle
function prepareTiles() {
  var pool = images.slice(); // copy
  var dupIndex = Math.floor(Math.random() * pool.length);
  // push the object reference of the duplicated image
  pool.push(pool[dupIndex]);
  // simple shuffle
  pool.sort(function() {
    return Math.random() - 0.5;
  });
  return pool;
}

// render images into the grid
function render() {
  grid.innerHTML = "";
  para.innerText = "";
  resetBtn.style.display = "none";
  verifyBtn.style.display = "none";
  selected = [];
  heading.innerText = "Please click on the identical tiles to verify that you are not a robot.";

  var tiles = prepareTiles();

  for (var i = 0; i < tiles.length; i++) {
    var info = tiles[i];
    var img = document.createElement("img");

    // assign both the generic 'tile' and the identity class like 'img1'
    img.className = "tile " + info.cls;
    img.src = info.url;
    img.alt = info.cls + " tile";
    // store identity (class string) in a simple property for comparison
    img.imageClass = info.cls;

    // click handler (simple)
    img.addEventListener("click", function(e) {
      var node = e.target;

      // if already selected => deselect it
      var found = false;
      for (var j = 0; j < selected.length; j++) {
        if (selected[j] === node) {
          found = true;
          node.classList.remove("selected");
          selected.splice(j, 1);
          break;
        }
      }

      if (!found) {
        // allow selecting new tile (we allow selecting many but verify shows only at exactly 2)
        node.classList.add("selected");
        selected.push(node);
      }

      updateButtons();
    });

    grid.appendChild(img);
  }
}

function updateButtons() {
  if (selected.length > 0) {
    resetBtn.style.display = "inline-block";
  } else {
    resetBtn.style.display = "none";
  }

  // show Verify only when exactly two distinct elements are selected
  if (selected.length === 2) {
    // ensure they are two different elements
    if (selected[0] !== selected[1]) {
      verifyBtn.style.display = "inline-block";
    } else {
      verifyBtn.style.display = "none";
    }
  } else {
    verifyBtn.style.display = "none";
  }

  para.innerText = ""; // clear result until verify clicked
}

resetBtn.addEventListener("click", function() {
  for (var i = 0; i < selected.length; i++) {
    selected[i].classList.remove("selected");
  }
  selected = [];
  updateButtons();
  para.innerText = "";
  heading.innerText = "Please click on the identical tiles to verify that you are not a robot.";
});

verifyBtn.addEventListener("click", function() {
  if (selected.length !== 2) {
    verifyBtn.style.display = "none";
    return;
  }

  // compare using the identity class we stored
  var firstClass = selected[0].imageClass;
  var secondClass = selected[1].imageClass;

  if (firstClass === secondClass) {
    para.innerText = "You are a human. Congratulations!";
  } else {
    para.innerText = "We can't verify you as a human. You selected the non-identical tiles.";
  }

  verifyBtn.style.display = "none";
});

// initial render
render();
