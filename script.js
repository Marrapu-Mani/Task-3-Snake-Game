const playBoardElement = document.querySelector(".play-board");
const scoreDisplay = document.querySelector(".score");
const highScoreDisplay = document.querySelector(".high-score");
const controlButtons = document.querySelectorAll(".game-controls i");

let isGameOver = false;
let foodPositionX, foodPositionY;
let snakeHeadX = 5, snakeHeadY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameIntervalId;
let currentScore = 0;

let savedHighScore = localStorage.getItem("high-score") || 0;
highScoreDisplay.innerText = `High Score: ${savedHighScore}`;

const generateRandomFoodPosition = () => {
    foodPositionX = Math.floor(Math.random() * 30) + 1;
    foodPositionY = Math.floor(Math.random() * 30) + 1;
};

const triggerGameOver = () => {
    clearInterval(gameIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeSnakeDirection = (event) => {
    if (event.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controlButtons.forEach(button => button.addEventListener("click", () => changeSnakeDirection({ key: button.dataset.key })));

const runGame = () => {
    if (isGameOver) return triggerGameOver();

    let boardHTML = `<div class="food" style="grid-area: ${foodPositionY} / ${foodPositionX}"></div>`;

    if (snakeHeadX === foodPositionX && snakeHeadY === foodPositionY) {
        generateRandomFoodPosition();
        snakeBody.push([foodPositionY, foodPositionX]);
        currentScore++;
        savedHighScore = currentScore >= savedHighScore ? currentScore : savedHighScore;
        localStorage.setItem("high-score", savedHighScore);
        scoreDisplay.innerText = `Score: ${currentScore}`;
        highScoreDisplay.innerText = `High Score: ${savedHighScore}`;
    }

    snakeHeadX += velocityX;
    snakeHeadY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeHeadX, snakeHeadY];

    if (snakeHeadX <= 0 || snakeHeadX > 30 || snakeHeadY <= 0 || snakeHeadY > 30) {
        return isGameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        boardHTML += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            isGameOver = true;
        }
    }

    playBoardElement.innerHTML = boardHTML;
};

generateRandomFoodPosition();
gameIntervalId = setInterval(runGame, 100);
document.addEventListener("keyup", changeSnakeDirection);
