var cheats = false,
	difficulty,
	small = false;

function setup() {
	createCanvas(600, 600);
	generateGrid();
	difficulty = 8;
}

function draw() {
	if (document.body.clientWidth < 650 && small == false) {
		small = true;
		generateGrid();
	} else if (document.body.clientWidth > 650 && small == true) {
		small = false;
		resizeCanvas(600, 600);
		generateGrid();
	}

	background(255);
	//WIN CONDITION bombs are calculated when the grid is generated, greys automatically take one from
	// uncovered. When a tile is correctly guessed 1 is added to uncovered
	if (100 - bombs == uncovered) {
		fill(0);
		textSize(100);
		text("GG", width / 2 - 100, height / 2);
		textSize(10);
		text("press the mouse to continue", width / 2 - 20, height / 1.5);
	} else {
		drawGrid();
	}
}

//grid[0] = x, grid[1] = y, grid[2] = r, grid[3] = bomb or not, grid[4] = number of bombs around,
//grid[5] = clicked?, grid[6] = flag
var grid, bombs, uncovered;
function generateGrid() {
	bombs = 0;
	uncovered = 0;
	grid = [];

	//defines dimensions of the grid
	var h = height;
	var w = width;
	var l = width / 10;

	//creates a grid of squares
	for (y = 0; y < h; y += l) {
		for (x = 0; x < w; x += l) {
			//each square is initialised with an x, y and l (length) value. It is also given a value
			//dependent on whether it is a bomb. The number of bombs around, whether it has been clicked
			// and whether its a flag are all set to zero to be initialized.
			grid.push([x, y, l, bomb(), 0, 0, 0]);
		}
	}

	//gives each tile the amount of bombs around if they themselves do not contain a bomb
	for (i = 0; i < grid.length; i++) {
		if (grid[i][3] == 0) {
			grid[i][4] = amountAround(i);
		} else {
			grid[i][4] = "B";
		}

		//takes the already uncovered tiles from the total
		if (grid[i][4] == 0) {
			uncovered += 1;
		}
	}
}

// 1 = bomb, 0 = no bomb
function bomb() {
	//picks a random number between 0 and 5 (includes decimal spaces). If the number is less than one
	// the function returns 0 (meaning there is a bomb in this tile). Otherwise it returns 0 (meaning
	// there is no bomb). the chances of a bomb are 1/8, statistically their are two bombs per row.
	//difficulty goes down each completion
	var b = random(0, difficulty);
	if (b > 1) {
		b = 0;
	} else {
		bombs += 1;
		b = 1;
	}
	return b;
}

function drawGrid() {
	for (i = 0; i < grid.length; i++) {
		//if the tile has a flag fill the square red, otherwise fill it white
		if (grid[i][6] == 1) {
			fill(255, 0, 0);
		} else if (grid[i][4] == 0) {
			fill(123);
			grid[i][5] = 1;
		} else if (grid[i][3] == 1 && cheats == true) {
			fill(255, 0, 0);
		} else {
			fill(255);
		}

		square(grid[i][0], grid[i][1], (width / grid[i][2]) * (width / 100));

		//if the tile is visible show the amount of surronding bombs
		if (grid[i][5] == 1) {
			fill(0);
			text(grid[i][4], grid[i][0] + width / 20, grid[i][1] + width / 20);
		}
	}
}

function mouseClicked() {
	//resets when game is won
	if (100 - bombs == uncovered) {
		generateGrid();
	}
	//if the user presses the left mouse button and any key on the keyboard, instead of revealing that
	//tile, a flag is placed (the tile turns red)
	if (mouseButton == LEFT && keyIsPressed == true && mouseX < width && mouseY < height) {
		//give tile flag
		if (grid[getMouseLoc()][6] == 0) {
			grid[getMouseLoc()][6] = 1;
		} else {
			grid[getMouseLoc()][6] = 0;
		}
	} else if (mouseX < width && mouseY < height) {
		// otherwise the tile is checked for a bomb
		if (grid[getMouseLoc()][3] == 0 && grid[getMouseLoc()][5] != 1) {
			//when their is no bomb, clicked becomes true and the flag is removed
			uncovered += 1;
			grid[getMouseLoc()][5] = 1;
			grid[getMouseLoc()][6] = 0;
		} else if (grid[getMouseLoc()][5] != 1) {
			//when their is a bomb, the grid is just regenerated to simulate a restart
			generateGrid();
		}
	}
}

function getMouseLoc() {
	mouseLoc = [];

	//the mouse location can be calculated by rounding up the sum of the mouse location / (the width /
	// 10) - 1. This is because a tile is placed every tenth of the width both length and height wise.
	//1 is taken of to simulate an array which starts from zero rather than one.
	mouseLocX = ceil(mouseX / (width / 10)) - 1;
	mouseLocY = ceil(mouseY / (width / 10)) - 1;

	mouseLoc = mouseLocX + mouseLocY * 10;

	return mouseLoc;
}

//calculates the number of bombs in the surrounding 8 tiles, not done for tiles with bombs
function amountAround(i) {
	if (i == 0) {
		//top left corner
		return tl();
	} else if (i == 9) {
		//top right corner
		return tr();
	} else if (i == 90) {
		//bottom left corner
		return bl();
	} else if (i == 99) {
		//bottom right corner
		return br();
	} else if (i % 10 == 0) {
		//vertical tiles on the far left
		return lv();
	} else if ((i + 1) % 10 == 0) {
		//vertical tiles on the far right
		return rv();
	} else if (i < 10) {
		//horizontal tiles on the top
		return th();
	} else if (i > 89) {
		//horizontal tiles on the bottom
		return bh();
	} else {
		return center();
	}
}

function center() {
	var counter = 0;

	//top left = - 11
	calc = i - 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top right = - 9
	calc = i - 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//botom left = + 9
	calc = i + 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom right = + 11
	calc = i + 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function tl() {
	var counter = 0;

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom right = + 11
	calc = i + 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function tr() {
	var counter = 0;

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//botom left = + 9
	calc = i + 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function bl() {
	var counter = 0;

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top right = - 9
	calc = i - 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function br() {
	var counter = 0;

	//top left = - 11
	calc = i - 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function lv() {
	var counter = 0;

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top right = - 9
	calc = i - 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom right = + 11
	calc = i + 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function rv() {
	var counter = 0;

	//top left = - 11
	calc = i - 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//botom left = + 9
	calc = i + 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function th() {
	var counter = 0;

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//botom left = + 9
	calc = i + 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom middle = + 10
	calc = i + 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//bottom right = + 11
	calc = i + 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}

function bh() {
	var counter = 0;

	//top left = - 11
	calc = i - 11;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top middle = - 10
	calc = i - 10;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//top right = - 9
	calc = i - 9;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle left = - 1
	calc = i - 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	//middle right = + 1
	calc = i + 1;
	if (grid[calc] != undefined) {
		if (grid[calc][3] == 1) {
			counter += 1;
		}
	}

	return counter;
}
