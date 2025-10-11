// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const scoreDisplay = document.getElementById("score");
const endMessage = document.getElementById("endMessage");

let score = 0;
let timer = 0;
let interval;
let gameOver = false;

// Ball
let ballRadius = canvas.width * 0.01; // Scales with canvas size
let x = canvas.width / 2;
let y = canvas.height - canvas.height * 0.05;
let dx = canvas.width * 0.005;
let dy = -canvas.height * 0.005;

// Paddle
const paddleHeight = canvas.height * 0.02;
const paddleWidth = canvas.width * 0.20;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Bricks
const brickRowCount = 4;
const brickColumnCount = 6;
const brickWidth = canvas.width * 0.11;
const brickHeight = canvas.height * 0.04;
const brickPadding = canvas.width * 0.012;
const brickOffsetTop = canvas.height * 0.10;
// Center the bricks horizontally
const totalBricksWidth = brickColumnCount * brickWidth + (brickColumnCount - 1) * brickPadding;
const brickOffsetLeft = (canvas.width - totalBricksWidth) / 2;

let bricks = [];

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0077ff";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#00bfff";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = "#f8b500";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 5;
          scoreDisplay.textContent = score;
          if (score === brickRowCount * brickColumnCount * 5) {
            endGame(true);
          }
        }
      }
    }
  }
}

function draw() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - 10) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      endGame(false);
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 5;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 5;
  }

  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "d") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft" || e.key === "a") {
    leftPressed = false;
  }
}

function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  endScreen.classList.add("hidden");

  // Recalculate sizes in case canvas size changed
  ballRadius = canvas.width * 0.015;
  x = canvas.width / 2;
  y = canvas.height - canvas.height * 0.05;
  dx = canvas.width * 0.005;
  dy = -canvas.height * 0.005;
  paddleX = (canvas.width - paddleWidth) / 2;

  initBricks();
  score = 0;
  scoreDisplay.textContent = 0;
  gameOver = false;
  clearInterval(interval);
  timer = 0;
  interval = setInterval(() => {
    timer++;
    document.getElementById("timer").textContent = `Elapsed Time: ${timer}s`;
  }, 1000);
  draw();
}

function endGame(win) {
  gameOver = true;
  clearInterval(interval);
  gameScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  endMessage.textContent = win
    ? "🎉 You Win! Clean water for all!"
    : "💧 Game Over! Try again to help more communities!";
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", () => {
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});