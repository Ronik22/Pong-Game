const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let score = document.getElementById("scoreNum").innerHTML;

let circle = {
	x: 100,
	y: 100,
	size: 15,
	dx: 5,
	dy: 5,
};

let player = {
	x: 200,
	y: canvas.height - 20,
	width: 100,
	height: 15,
	speed: 10,
	dx: 0,
	dy: 0,
};

let blocks = {
	x: 13,
	y: 10,
	width: 53,
	height: 15,
	gap: 5,
	countX: 10,
	countY: 3
};

function updateScore() {
	score = (parseInt(score) + 1).toString();
	document.getElementById("scoreNum").innerHTML = score;
}


function drawPlayer() {
	ctx.beginPath();
	ctx.rect(player.x, player.y, player.width, player.height);
	ctx.fillStyle = "red";
	ctx.fill();
}

var allBlocks = []

function blockSetup() {
	distX = 0;
	distY = 0;
	for(j=1;j<=blocks.countY;j=j+1) {
		for(i=1;i<=blocks.countX;i=i+1) {
			allBlocks.push({
				x: blocks.x + distX,
				y: blocks.y + distY,
				status: 1
			});
			distX += blocks.width + blocks.gap;
		}
		distX = 0;
		distY += blocks.height + blocks.gap;
	}	
	// console.log(allBlocks)
}
blockSetup();


function drawBlocks() {
	allBlocks.forEach((block) => {
		if (!block.status) return;
		ctx.beginPath();
		ctx.rect(block.x, block.y, blocks.width, blocks.height);
		ctx.fillStyle = "#0bd600";
		ctx.fill();
		ctx.closePath();
	});
}

function collisionDetection() {
	allBlocks.forEach((b) => {
		if (!b.status) return;

		var inBricksColumn = circle.x > b.x && circle.x < b.x + blocks.width;
		var inBricksRow = circle.y > b.y && circle.y < b.y + blocks.height;
		if (inBricksColumn && inBricksRow) {
			circle.dy *= -1;
			b.status = 0;
			updateScore();
		}
	});
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

function detectWalls() {
	// Left wall
	if (player.x < 0) {
		player.x = 0;
	}

	// Right Wall
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
	drawBlocks();
	drawCircle();
	drawPlayer();
	newPos();
	collisionDetection();

	// change position
	circle.x += circle.dx;
	circle.y += circle.dy;

	wallDetection();

	// score reset condition
	if (circle.y + circle.size > canvas.height) {
		clickedOnce = true;
		return;
		// score = "0";
		// document.getElementById("scoreNum").innerHTML = score;
	}

	// Detect collision between player and circle
	if (
		circle.y + circle.size === player.y &&
		circle.x + circle.size > player.x &&
		circle.x - circle.size < player.x + player.width
	) {	
		circle.dy *= -1;
	}

    if(score === (blocks.countX * blocks.countY).toString()){
        alert("Congratulations!!! You Won.");
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