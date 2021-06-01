const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let score = document.getElementById("scoreNum").innerHTML;
let scoreOp = document.getElementById("scoreOpNum").innerHTML;

let circle = {
	x: 100,
	y: 100,
	size: 15,
	dx: 5,
	dy: 5
};

let player = {
	x: 200,
	y: canvas.height - 20,
	width: 100,
	height: 15,
	speed: 10,
	dx: 0,
	dy: 0
};

let opponent = {
	x: 200,
	y: 5,
	width: 100,
	height: 15,
	speed: 6
};


function updateScore() {
	score = (parseInt(score) + 10).toString();
	document.getElementById("scoreNum").innerHTML = score;
}

function updateOpponentScore() {
	scoreOp = (parseInt(scoreOp) + 10).toString();
	document.getElementById("scoreOpNum").innerHTML = scoreOp;
}


function drawPlayer() {
	ctx.beginPath();
	ctx.rect(player.x, player.y, player.width, player.height);
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function drawOpponent() {
	ctx.beginPath();
	ctx.rect(opponent.x, opponent.y, opponent.width, opponent.height);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();
}


function drawCircle() {
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
	ctx.fillStyle = "rgb(113, 24, 255)";
	ctx.fill();
	ctx.closePath();
}

function newPos() {
	player.x += player.dx;
	detectWalls();
}

function opponentMovement() {
	opponent.x += opponent.speed;

	if (opponent.x < 0) {
		opponent.speed *= -1;
	}
	if (opponent.x + opponent.width > canvas.width) {
		opponent.speed *= -1;
	}
}


function detectWalls() {
	// player
	if (player.x < 0) {
		player.x = 0;
	}
	if (player.x + player.width > canvas.width) {
		player.x = canvas.width - player.width;
	}
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function wallDetection() {
	// Detect side walls
	if (circle.x + circle.size > canvas.width || circle.x - circle.size < 0) {
		circle.dx *= -1;
	}

	// Detect top and bottom walls
	if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
		circle.dy *= -1;
	}
}


function update() {
	clear();
	drawCircle();
	drawPlayer();
	drawOpponent();
	newPos();

	// change position
	circle.x += circle.dx;
	circle.y += circle.dy;

	wallDetection();
	opponentMovement();

	// score reset condition
	if (circle.y + circle.size > canvas.height) {
		score = "0";
		document.getElementById("scoreNum").innerHTML = score;
	}

	// Detect collision between player and circle
	if (
		circle.y + circle.size === player.y &&
		circle.x + circle.size > player.x &&
		circle.x - circle.size < player.x + player.width
	) {	
		circle.dy *= -1;
		updateScore();
	}


	// Detect collision between opponent and circle
	if (
		circle.y - circle.size === opponent.y + opponent.height &&
		circle.x + circle.size > opponent.x &&
		circle.x - circle.size < opponent.x + opponent.width
	) {	
		circle.dy *= -1;
		updateOpponentScore();
	}

	//Winner check

	if(score === "100"){
        alert("Congratulations!!! You Won.");
		clickedOnce = true;
        return;
    }
	if (scoreOp === "100"){
		alert("Oops!!! Computer Won.");
		clickedOnce = true;
        return;
	}

	requestAnimationFrame(update);
}

function moveRight() {
	player.dx = player.speed;
}

function moveLeft() {
	player.dx = -player.speed;
}

function keyDown(e) {
	if (
		e.key === "ArrowRight" ||
		e.key === "Right" ||
		e.key === "d" ||
		e.key === "D"
	) {
		moveRight();
	} else if (
		e.key === "ArrowLeft" ||
		e.key === "Left" ||
		e.key === "a" ||
		e.key === "A"
	) {
		moveLeft();
	}
}

function keyUp(e) {
	if (
		e.key == "Right" ||
		e.key == "ArrowRight" ||
		e.key == "Left" ||
		e.key == "ArrowLeft" ||
		e.key == "a" ||
		e.key == "d" ||
		e.key == "A" ||
		e.key == "D"
	) {
		player.dx = 0;
	}
}

function reset(){
	document.location.reload();
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

let clickedOnce = false;
document.getElementById("start").onclick = () => {
	if (clickedOnce == false) {
		clickedOnce = true;
		update();
	}
};

// update();