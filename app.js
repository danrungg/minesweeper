let bombLocations = []; // BOMB LOCATION
let numberOfSquares = 9; // NUMBER OF SQUARES
let numberOfBombs = 10;
let regex = /([0-9]+)(-)([0-9]+)/;
let correctGuesses = 0;

// INITIAL GENERATION

// function to generate grid
let container = document.querySelector(".container");
function generateGrid(numberOfSquares) {
	for (let i = 1; i <= numberOfSquares; i++) {
		for (let j = 1; j <= numberOfSquares; j++) {
			let newDiv = document.createElement("div");
			newDiv.classList.add("square", `${i}-${j}`, "hidden");
			container.appendChild(newDiv);
		}
	}
	container.style.gridTemplateColumns = `repeat(${numberOfSquares}, 1fr)`;
	container.style.gridTemplateRows = `repeat(${numberOfSquares}, 1fr)`;
}
generateGrid(numberOfSquares);

function generateBombs() {
	while (bombLocations.length < numberOfBombs) {
		let temp = `${Math.floor(Math.random() * 9) + 1}-${
			Math.floor(Math.random() * 9) + 1
		}`;

		if (!bombLocations.includes(temp)) {
			bombLocations.push(temp);
		}
	}
}

generateBombs();

// add bomb to classlist
let squares = document.querySelectorAll(".square");
function addBombs() {
	squares.forEach((square) => {
		// 👇 this works!
		if (
			bombLocations.some((bombLocation) =>
				square.classList.contains(bombLocation)
			)
		) {
			square.classList.add("bomb");
		}
	});
}
addBombs();

// calculate surroundingNumbers
function generateNumbers() {
	/*
	1-1	1-2	1-3
	2-1	2-2	2-3
	3-1	3-2	3-3
	*/

	let surroundingNumbers = [];
	bombLocations.forEach((location) => {
		let firstNumber = Number(regex.exec(location)[1]);
		let secondNumber = Number(regex.exec(location)[3]);

		for (let j = secondNumber - 1; j <= secondNumber + 1; j++) {
			for (let i = firstNumber - 1; i <= firstNumber + 1; i++) {
				surroundingNumbers.push(`${i}-${j}`);
			}
		}
	});

	surroundingNumbers = surroundingNumbers.filter(
		// !!!with curly braces it doesnt work
		(item) => !bombLocations.includes(item)
	);

	return surroundingNumbers;
}
// add surronding numbers to classlist
function addNumbers() {
	let sortedNumbers = generateNumbers().sort();

	for (let i = 1; i < 9; i++) {
		let lol = getKeyByValue(findDuplicates(sortedNumbers), i);

		squares.forEach((square) => {
			// 👇 this works!
			if (lol.some((lol) => square.classList.contains(lol))) {
				square.classList.add("Number", `_${i}`);
			}
		});
	}
}
addNumbers();

function findDuplicates(sortedNumbers) {
	// https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
	// idk but this works
	var count = {};
	sortedNumbers.forEach(function (i) {
		count[i] = (count[i] || 0) + 1;
	});

	return count;
}

function getKeyByValue(object, value) {
	return Object.keys(object).filter((key) => object[key] === value);
}

// OK NOW USER INTERACTION

// set flag function and toggle flag class
function setFlag(field) {
	field.classList.toggle("flag");

	if (field.classList.contains("flag") && field.classList.contains("bomb")) {
		correctGuesses += 1;
	} else if (
		!field.classList.contains("flag") &&
		field.classList.contains("bomb")
	) {
		correctGuesses -= 1;
	}

	checkWin();
}

function checkWin() {
	if (correctGuesses === numberOfBombs) {
		setTimeout(function () {
			alert("WINRAR");
		}, 100);
		container.style.pointerEvents = "none";
		squares.forEach((square) => {
			square.classList.remove("hidden");

			if (
				square.classList.contains("bomb") ||
				square.classList.contains("Number") ||
				square.classList.contains("blanc")
			) {
				return;
			} else {
				square.classList.add("blanc");
			}
		});
	}
}

//  check if bomb is klickt with left click and display game over
function checkBomb(field) {
	if (!field.classList.contains("flag") && field.classList.contains("bomb")) {
		// run game over function
		gameOver();
	}
}

function gameOver() {
	// runf function reveal bombs
	revealBombs();
	// settimeout so can revealBombs function can run
	setTimeout(function () {
		alert("GAME OVER");
	}, 100);
	// after gameover prevent player from clicking
	container.style.pointerEvents = "none";
	squares.forEach((square) => {
		square.classList.remove("hidden");

		if (
			square.classList.contains("bomb") ||
			square.classList.contains("Number") ||
			square.classList.contains("blanc")
		) {
			return;
		} else {
			square.classList.add("blanc");
		}
	});
}

// revealBombs function, display all bombs
function revealBombs() {
	squares.forEach((square) => {
		if (square.classList.contains("bomb")) {
			square.classList.toggle("hidden");
			square.style.background = "#ee4266";
			square.innerText = "💣";
		}
	});
}

function revealBlancFields(firstNumber, secondNumber) {
	if (
		firstNumber < 1 ||
		firstNumber > numberOfSquares ||
		secondNumber < 1 ||
		secondNumber > numberOfSquares
	)
		return;

	if (
		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.contains("Number")
	) {
		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.remove("hidden");
		return;
	}

	if (
		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.contains("bomb") ||
		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.contains("blanc")
	) {
		return;
	} else {
		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.add("blanc");

		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.remove("flag");

		container
			.getElementsByClassName(`${firstNumber}-${secondNumber}`)[0]
			.classList.remove("hidden");

		revealBlancFields(firstNumber - 1, secondNumber - 1);
		revealBlancFields(firstNumber - 1, secondNumber);
		revealBlancFields(firstNumber - 1, secondNumber + 1);
		revealBlancFields(firstNumber, secondNumber - 1);
		revealBlancFields(firstNumber, secondNumber + 1);
		revealBlancFields(firstNumber + 1, secondNumber - 1);
		revealBlancFields(firstNumber + 1, secondNumber);
		revealBlancFields(firstNumber + 1, secondNumber + 1);
	}
}

// EVENT LISTENERS
container.addEventListener("contextmenu", (e) => {
	setFlag(e.target);
});

// prevent right click window
container.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});

container.addEventListener("click", (e) => {
	checkBomb(e.target);

	let firstNumber = Number(regex.exec(e.target.classList[1])[1]);
	let secondNumber = Number(regex.exec(e.target.classList[1])[3]);
	revealBlancFields(firstNumber, secondNumber);
	e.target.classList.remove("hidden");
});

/*
firstNumber 
|
|
|
v

secondNumber --->
*/
