var grid,
    snake,
    dir = 0,
    snakePlaces,
    spCounter,
    length,
    amountOfMoves,
    playing;

function setup() {
    createCanvas(500, 500);
    width = height;
    amountOfMoves = 0;
    playing = false;
    gridInit();
    frameRate(10);

    strokeWeight(0.5);

    document.getElementById("defaultCanvas0").focus();

    drawGrid();
}

function draw() {
    if (playing) {
        snakeUpdate();
        drawGrid();
    }
}

function gridInit() {
    grid = [];
    snake = [];
    snakePlaces = [];
    spCounter = 0;
    length = 1;
    amountOfMoves = 1;

    var h = height;
    var w = width;
    var r = width / 10;

    for (y = 0; y < h; y += r) {
        for (x = 0; x < w; x += r) {
            grid.push([x, y, r, 0]);
        }
    }

    grid[55][3] = 1;
    snake[0] = 55;
    snakePlaces.push(snake[0]);

    generateFood();
}

function drawGrid() {
    for (i = 0; i < grid.length; i++) {
        if (grid[i][3] == 2) {
            noStroke();
            fill(255, 0, 0);
        } else if (grid[i][3] == 1) {
            noStroke();
            fill(89, 152, 47);
        } else {
            stroke(0);
            fill(255);
        }
        square(grid[i][0], grid[i][1], grid[i][2]);
    }
}

//DIR:
//0 = left
//1 = right
//2 = up
//3 = down
//---------------------
//snake[0] = grid index
function snakeUpdate() {
    amountOfMoves += 1;

    //out of bounds check
    if (dir == 0 && snake[0] % 10 == 0) {
        console.log("L");
        gameOver();
    } else if (dir == 1 && snake[0] % 10 == 9) {
        console.log("R");
        gameOver();
    } else if (dir == 2 && snake[0] - 10 < 0) {
        console.log("U");
        gameOver();
    } else if (dir == 3 && snake[0] + 10 > grid.length) {
        console.log("D");
        gameOver();
    }

    //food check
    if (dir == 0 && grid[snake[0] - 1][3] == 2) {
        growSnake();
    } else if (dir == 1 && grid[snake[0] + 1][3] == 2) {
        growSnake();
    } else if (dir == 2 && grid[snake[0] - 10][3] == 2) {
        growSnake();
    } else if (dir == 3 && grid[snake[0] + 10][3] == 2) {
        growSnake();
    }

    //collision check
    if (dir == 0 && grid[snake[0] - 1][3] == 1) {
        console.log("L col");
        gameOver();
    } else if (dir == 1 && grid[snake[0] + 1][3] == 1) {
        console.log("R col");
        gameOver();
    } else if (dir == 2 && grid[snake[0] - 10][3] == 1) {
        console.log("U col");
        gameOver();
    } else if (dir == 3 && grid[snake[0] + 10][3] == 1) {
        console.log("D col");
        gameOver();
    }

    //movement
    if (dir == 0) {
        snake[0] -= 1;
        grid[snake[0]][3] = 1;
        grid[snake[0] + 1][3] = 0;
        recordSnake();
    } else if (dir == 1) {
        snake[0] += 1;
        grid[snake[0]][3] = 1;
        grid[snake[0] - 1][3] = 0;
        recordSnake();
    } else if (dir == 2) {
        snake[0] -= 10;
        grid[snake[0]][3] = 1;
        grid[snake[0] + 10][3] = 0;
        recordSnake();
    } else if (dir == 3) {
        snake[0] += 10;
        grid[snake[0]][3] = 1;
        grid[snake[0] - 10][3] = 0;
        recordSnake();
    }

    //draw the rest of the snake
    //draw the other parts according to the previous locations
    for (i = 1; i < length; i++) {
        grid[snakePlaces[amountOfMoves - i]][3] = 1;
        grid[snakePlaces[amountOfMoves - i - 1]][3] = 0;
    }
}

function growSnake() {
    length += 1;
    snake.push(snakePlaces[spCounter - length]);
    generateFood();
}

function gameOver() {
    gridInit();
    playing = false;
}

function keyPressed() {
    if (length == 1) {
        if (keyCode === LEFT_ARROW) {
            dir = 0;
        } else if (keyCode === RIGHT_ARROW) {
            dir = 1;
        } else if (keyCode === UP_ARROW) {
            dir = 2;
        } else if (keyCode === DOWN_ARROW) {
            dir = 3;
        }
    } else {
        if (dir != 1 && keyCode === LEFT_ARROW) {
            dir = 0;
        } else if (dir != 0 && keyCode === RIGHT_ARROW) {
            dir = 1;
        } else if (dir != 3 && keyCode === UP_ARROW) {
            dir = 2;
        } else if (dir != 2 && keyCode === DOWN_ARROW) {
            dir = 3;
        }
    }

    playing = true;
}

function recordSnake() {
    snakePlaces.push(snake[0]);
    spCounter += 1;
}

function generateFood() {
    foodLoc = int(random(0, 99));
    if (grid[foodLoc][3] == 1) {
        generateFood();
    } else {
        grid[foodLoc][3] = 2;
    }
}
