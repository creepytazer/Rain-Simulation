if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
var queue = [];
var running = false;
var mouseDown = 0;

function ready() {
  initiateEventListeners();
  updateBoard();
}
document.body.onmousedown = function () {
  mouseDown = 1;
};
document.body.onmouseup = function () {
  mouseDown = 0;
};

function checkWidth(event) {
  currentWidth = event.target;
  if (isNaN(currentWidth.value) || currentWidth.value < 3) {
    currentWidth.value = 3;
  }
  currentWidth.value = Math.round(currentWidth.value);
  if (currentWidth.value > 30) {
    currentWidth.value = 30;
  }
  updateBoard();
}
function checkHeight(event) {
  currentHeight = event.target;
  if (isNaN(currentHeight.value) || currentHeight.value < 2) {
    currentHeight.value = 2;
  }
  currentHeight.value = Math.round(currentHeight.value);
  if (currentHeight.value > 15) {
    currentHeight.value = 15;
  }
  updateBoard();
}
function checkSpeed(event) {
  currentSpeed = event.target;
  if (isNaN(currentSpeed.value) || currentSpeed.value < 1) {
    currentSpeed.value = 1;
  }
  currentSpeed.value = Math.round(currentSpeed.value);
  if (currentSpeed.value > 30) {
    currentSpeed.value = 30;
  }
}

function updateBoard() {
  queue = [];
  width = document.getElementById("width-input").value;
  height = document.getElementById("height-input").value;
  gameBoard = document.getElementById("gameboard");
  newBoard = "";
  rainZone = `<div data-row="0" data-width="${width}" class="game-row">`;
  for (var col = 0; col < width; col++) {
    rainZone += `<img data-type="rainEmpty" data-waterstate="none" data-row="0" data-col="${col}" draggable="false" class="game-tile"src="recourses/rainEmpty.png">`;
  }
  rainZone += "</div>";
  newBoard += rainZone;
  for (var row = 1; row < height; row++) {
    newRow = `<div data-row="${row}" data-width="${width}" class="game-row">`;
    for (var col = 0; col < width; col++) {
      newRow += `<img data-type="empty" data-waterstate="none" data-row="${row}" data-col="${col}" draggable="false" class="game-tile"src="recourses/empty.png">`;
    }
    newRow += "</div>";
    newBoard += newRow;
  }
  gameBoard.innerHTML = newBoard;
  gameTiles = document.getElementsByClassName("game-tile");
  for (var i = 0; i < gameTiles.length; i++) {
    gameTiles[i].addEventListener("click", (event) => updateTile(event, true));
    gameTiles[i].addEventListener("mouseover", (event) =>
      updateTile(event, false)
    );
  }
}

function updateSelected(event) {
  selectors = document.getElementsByClassName("placing-box");
  for (var i = 0; i < selectors.length; i++) {
    selectors[i].dataset.selected = "False";
  }
  currentlySelected = event.target;
  if (currentlySelected.tagName != "DIV") {
    currentlySelected = currentlySelected.parentElement;
  }
  currentlySelected.dataset.selected = "True";
  placing = currentlySelected.dataset.type;
}

function initiateEventListeners() {
  document.getElementById("width-input").addEventListener("change", checkWidth);
  document
    .getElementById("height-input")
    .addEventListener("change", checkHeight);
  document.getElementById("speed-input").addEventListener("change", checkSpeed);
  document
    .getElementsByClassName("run-btn")[0]
    .addEventListener("click", runGame);
  document
    .getElementsByClassName("btn-red")[0]
    .addEventListener("click", updateBoard);
  placeModes = document.getElementsByClassName("placing-box");
  for (var i = 0; i < placeModes.length; i++) {
    placeModes[i].addEventListener("click", updateSelected);
  }
}

var placing = "None";
function updateTile(event, clicked) {
  if (
    placing == "None" ||
    running == true ||
    (mouseDown == 0 && clicked == false)
  ) {
    return;
  }
  tileClicked = event.target;
  if (placing == "wall") {
    replace(
      tileClicked.dataset.row,
      tileClicked.dataset.col,
      "wall",
      "recourses/wall.png"
    );
  }
  if (placing == "rain") {
    replace(0, tileClicked.dataset.col, "rain", "recourses/rain cloud.png");
  }
  if (placing == "eraser") {
    replace(
      tileClicked.dataset.row,
      tileClicked.dataset.col,
      "eraser",
      "recourses/empty.png"
    );
  }
}

function replace(row, col, type, src) {
  grid = document.getElementsByClassName("game-row");
  if (type == "none" || running == true) {
    return;
  }

  if (type == "eraser") {
    if (row == 0) {
      grid[row].children[col].dataset.type = "rainEmpty";
      grid[row].children[col].src = "recourses/rainEmpty.png";
    } else {
      grid[row].children[col].dataset.type = "empty";
      grid[row].children[col].src = "recourses/empty.png";
    }
    grid[row].children[col].dataset.waterstate = "none";
    grid[row].children[col].className = "game-tile";
    return;
  }
  if (type == "rain") {
    grid[0].children[col].dataset.type = `${type}`;
    grid[0].children[col].src = `${src}`;
    grid[0].children[col].className = "rain-tile game-tile";
    return;
  }
  if (type == "wall") {
    grid[row].children[col].dataset.type = `${type}`;
    grid[row].children[col].dataset.waterstate = "none";
    grid[row].children[col].src = `${src}`;
    grid[row].children[col].className = "game-tile";
  }
}

function runGame() {
  if (running == true) {
    return;
  }
  running = true;
  document.getElementById("width-input").disabled = true;
  document.getElementById("height-input").disabled = true;
  document.getElementById("speed-input").disabled = true;
  speed = document.getElementById("speed-input").value;
  clouds = document.getElementsByClassName("rain-tile");
  grid = document.getElementById("gameboard").children;

  for (var r = 0; r < grid.length; r++) {
    for (var c = 0; c < grid[0].children.length; c++) {
      if (grid[r].children[c].dataset.type == "rain") {
        queue.push([r + 1, c]);
      } else if (grid[r].children[c].dataset.type == "water") {
        queue.push([r, c]);
      }
    }
  }

  rain();
}
function rain() {
  range = queue.length;
  for (var i = 0; i < range; i++) {
    curr = queue.shift();
    var r = curr[0];
    var c = curr[1];
    var currRow = grid[r].children;
    var tile = currRow[c];

    tile.src = "recourses/water.png";
    tile.dataset.waterstate = "checking";
    tile.dataset.type = "water";

    if (
      c - 1 < 0 ||
      c + 1 == currRow.length ||
      currRow[c - 1].dataset.waterstate == "leak" ||
      currRow[c + 1].dataset.waterstate == "leak" ||
      (r + 1 < grid.length &&
        grid[r + 1].children[c].dataset.waterstate == "leak")
    ) {
      tile.dataset.waterstate = "leak";
      tile.src = "recourses/empty.png";
      tile.dataset.type = "empty";
      continue;
    }
    if (
      (currRow[c - 1].dataset.type == "wall" ||
        currRow[c - 1].dataset.waterstate == "10" ||
        currRow[c - 1].dataset.waterstate == "full") &&
      (currRow[c + 1].dataset.type == "wall" ||
        currRow[c + 1].dataset.waterstate == "01" ||
        currRow[c + 1].dataset.waterstate == "full") &&
      (r + 1 == grid.length ||
        grid[r + 1].children[c].dataset.waterstate == "full" ||
        grid[r + 1].children[c].dataset.type == "wall")
    ) {
      tile.dataset.waterstate = "full";
      continue;
    }

    queue.push([r, c]);
    if (
      r + 1 < grid.length &&
      grid[r + 1].children[c].dataset.type != "wall" &&
      grid[r + 1].children[c].dataset.waterstate == "none"
    ) {
      queue.push([r + 1, c]);
      grid[r + 1].children[c].dataset.type = "water";
    } else if (
      r == grid.length - 1 ||
      grid[r + 1].children[c].dataset.waterstate == "full" ||
      grid[r + 1].children[c].dataset.type == "wall"
    ) {
      if (currRow[c - 1].dataset.type == "empty") {
        currRow[c - 1].dataset.type = "water";
        queue.push([r, c - 1]);
      }
      if (currRow[c + 1].dataset.type == "empty") {
        currRow[c + 1].dataset.type = "water";
        queue.push([r, c + 1]);
      }
    }

    if (
      (currRow[c - 1].dataset.type == "wall" ||
        currRow[c - 1].dataset.waterstate == "10") &&
      (r + 1 == grid.length ||
        grid[r + 1].children[c].dataset.waterstate == "full" ||
        grid[r + 1].children[c].dataset.type == "wall")
    ) {
      tile.dataset.waterstate = "10";
    }
    if (
      (currRow[c + 1].dataset.type == "wall" ||
        currRow[c - 1].dataset.waterstate == "01") &&
      (r + 1 == grid.length ||
        grid[r + 1].children[c].dataset.waterstate == "full" ||
        grid[r + 1].children[c].dataset.type == "wall")
    ) {
      tile.dataset.waterstate = "01";
    }
  }
  if (queue.length > 0) {
    setTimeout(rain, 1000 / speed);
  } else {
    for (var r = 0; r < grid.length; r++) {
      for (var c = 0; c < grid[r].children.length; c++) {
        if (grid[r].children[c].dataset.waterstate == "leak") {
          grid[r].children[c].dataset.waterstate = "none";
        }
        if (grid[r].children[c].dataset.waterstate == "full") {
          grid[r].children[c].dataset.waterstate = "checking";
        }
      }
    }
    document.getElementById("width-input").disabled = false;
    document.getElementById("height-input").disabled = false;
    document.getElementById("speed-input").disabled = false;
    running = false;
  }
}
