//current project showing index
var i = 0;
//number of projects to show
var n = 2;

function nextProject() {
    i++;
    if (i == n + 1) {
        i = 0;
    }

    updateProject();
}

function previousProject() {
    if (i == 0) {
        i = n + 1;
    }
    i--;

    updateProject();
}

var title = document.getElementById("title");
var img = document.getElementById("img");

function updateProject() {
    if (i == 0) {
        title.innerText = "Conway's Game of Life";
        img.src = "images/conway.jpg";
    } else if (i == 1) {
        title.innerText = "Snake";
        img.src = "images/snake.jpg";
    } else if (i == 2) {
        title.innerText = "Unbeatable TicTacToe AI";
        img.src = "images/tictactoe.jpg";
    }
}
