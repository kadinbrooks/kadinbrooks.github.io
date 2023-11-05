//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;

let birdX = boardWidth / 8;
let birdY = boardHeight / 2;

let birdImage;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let space = boardHeight / 4;

let topPipeImage;
let bottomPipeImage;

//physics
let velocityX = -2; //pipe left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;




window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on board

    //draw flappy bird
    birdImage = new Image();
    birdImage.src = "./flappybird.png";
    birdImage.onload = function() {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }
    
    topPipeImage = new Image();
    topPipeImage.src = "./toppipe.png";

    bottomPipeImage = new Image();
    bottomPipeImage.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1750);
    document.addEventListener("keydown", moveBirdKey);
    document.addEventListener("touchstart", moveBirdTouch);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // removes first element from the array
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    
    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }
    
    let randomPipeY = pipeY - (pipeHeight / 4) - Math.random() * (pipeHeight / 2);

    let topPipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + space,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBirdKey(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function moveBirdTouch(e) {
    velocityY = -6;
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}