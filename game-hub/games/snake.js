const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const bestElement =
    document.getElementById("best");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");


const SIZE = 700;

const GRID = 35;

const CELL =
    SIZE / GRID;


let snake = [];

let food = {};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;

let bestScore =
    Number(
        localStorage.getItem(
            "snakeBest"
        )
    ) || 0;

let gameRunning = false;

let gameTimer;


bestElement.textContent =
    bestScore;


// ========================================
// KEYBOARD
// ========================================

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key.toLowerCase();


        if (
            key === "arrowup" ||
            key === "w"
        ) {

            changeDirection(
                0,
                -1
            );

        }


        if (
            key === "arrowdown" ||
            key === "s"
        ) {

            changeDirection(
                0,
                1
            );

        }


        if (
            key === "arrowleft" ||
            key === "a"
        ) {

            changeDirection(
                -1,
                0
            );

        }


        if (
            key === "arrowright" ||
            key === "d"
        ) {

            changeDirection(
                1,
                0
            );

        }

    }
);


// ========================================
// CHANGE DIRECTION
// ========================================

function changeDirection(
    x,
    y
) {

    if (!gameRunning) {
        return;
    }


    if (
        x === -direction.x &&
        y === -direction.y
    ) {

        return;

    }


    nextDirection = {
        x: x,
        y: y
    };

}


// ========================================
// CREATE FOOD
// ========================================

function createFood() {

    let validPosition =
        false;


    while (
        !validPosition
    ) {

        food = {

            x:
                Math.floor(
                    Math.random() *
                    GRID
                ),

            y:
                Math.floor(
                    Math.random() *
                    GRID
                )

        };


        validPosition =
            !snake.some(
                segment =>
                    segment.x ===
                    food.x &&

                    segment.y ===
                    food.y
            );

    }

}


// ========================================
// START GAME
// ========================================

function startGame() {

    snake = [

        {
            x: 17,
            y: 17
        },

        {
            x: 16,
            y: 17
        },

        {
            x: 15,
            y: 17
        }

    ];


    direction = {
        x: 1,
        y: 0
    };


    nextDirection = {
        x: 1,
        y: 0
    };


    score = 0;


    scoreElement.textContent =
        score;


    createFood();


    gameRunning = true;


    startScreen.style.display =
        "none";


    clearInterval(
        gameTimer
    );


    gameTimer =
        setInterval(
            gameLoop,
            100
        );

}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

    if (
        !gameRunning
    ) {

        return;

    }


    direction =
        nextDirection;


    const head = {

        x:
            snake[0].x +
            direction.x,

        y:
            snake[0].y +
            direction.y

    };


    // Wall collision

    if (
        head.x < 0 ||
        head.x >= GRID ||
        head.y < 0 ||
        head.y >= GRID
    ) {

        gameOver();

        return;

    }


    // Body collision

    if (
        snake.some(
            segment =>
                segment.x ===
                head.x &&

                segment.y ===
                head.y
        )
    ) {

        gameOver();

        return;

    }


    snake.unshift(
        head
    );


    // Eat food

    if (
        head.x === food.x &&
        head.y === food.y
    ) {

        score += 10;


        scoreElement.textContent =
            score;


        if (
            score >
            bestScore
        ) {

            bestScore =
                score;


            bestElement.textContent =
                bestScore;


            localStorage.setItem(
                "snakeBest",
                bestScore
            );

        }


        createFood();

    }

    else {

        snake.pop();

    }


    draw();

}


// ========================================
// DRAW GAME
// ========================================

function draw() {

    // Background

    ctx.fillStyle =
        "#0c1117";

    ctx.fillRect(
        0,
        0,
        SIZE,
        SIZE
    );


    // Grid

    drawGrid();


    // Food

    drawFood();


    // Snake

    drawSnake();

}


// ========================================
// DRAW GRID
// ========================================

function drawGrid() {

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    for (
        let i = 0;
        i <= GRID;
        i++
    ) {

        ctx.beginPath();

        ctx.moveTo(
            i * CELL,
            0
        );

        ctx.lineTo(
            i * CELL,
            SIZE
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            0,
            i * CELL
        );

        ctx.lineTo(
            SIZE,
            i * CELL
        );

        ctx.stroke();

    }

}


// ========================================
// DRAW SNAKE
// ========================================

function drawSnake() {

    snake.forEach(
        (segment, index) => {

            const padding =
                2;


            if (
                index === 0
            ) {

                ctx.fillStyle =
                    "#4ade80";

            }

            else {

                ctx.fillStyle =
                    "#22c55e";

            }


            ctx.beginPath();

            ctx.roundRect(
                segment.x * CELL +
                padding,

                segment.y * CELL +
                padding,

                CELL -
                padding * 2,

                CELL -
                padding * 2,

                6
            );

            ctx.fill();


            // Eyes

            if (
                index === 0
            ) {

                drawSnakeEyes(
                    segment
                );

            }

        }
    );

}


// ========================================
// DRAW EYES
// ========================================

function drawSnakeEyes(
    head
) {

    ctx.fillStyle =
        "#111";


    let eye1;
    let eye2;


    if (
        direction.x === 1
    ) {

        eye1 = {
            x: head.x * CELL + 23,
            y: head.y * CELL + 10
        };

        eye2 = {
            x: head.x * CELL + 23,
            y: head.y * CELL + 25
        };

    }

    else if (
        direction.x === -1
    ) {

        eye1 = {
            x: head.x * CELL + 12,
            y: head.y * CELL + 10
        };

        eye2 = {
            x: head.x * CELL + 12,
            y: head.y * CELL + 25
        };

    }

    else if (
        direction.y === -1
    ) {

        eye1 = {
            x: head.x * CELL + 10,
            y: head.y * CELL + 12
        };

        eye2 = {
            x: head.x * CELL + 25,
            y: head.y * CELL + 12
        };

    }

    else {

        eye1 = {
            x: head.x * CELL + 10,
            y: head.y * CELL + 23
        };

        eye2 = {
            x: head.x * CELL + 25,
            y: head.y * CELL + 23
        };

    }


    ctx.beginPath();

    ctx.arc(
        eye1.x,
        eye1.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        eye2.x,
        eye2.y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ========================================
// DRAW FOOD
// ========================================

function drawFood() {

    const x =
        food.x * CELL +
        CELL / 2;

    const y =
        food.y * CELL +
        CELL / 2;


    ctx.fillStyle =
        "#ef4444";


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        CELL * 0.32,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#fca5a5";


    ctx.beginPath();

    ctx.arc(
        x - 4,
        y - 5,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#22c55e";

    ctx.beginPath();

    ctx.ellipse(
        x + 6,
        y - 13,
        7,
        3,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();

}


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    gameRunning = false;


    clearInterval(
        gameTimer
    );


    startScreen.innerHTML = `

        <h2>GAME OVER</h2>

        <p>
            Điểm của bạn:
            <strong>${score}</strong><br>

            Kỷ lục:
            <strong>${bestScore}</strong>
        </p>

        <button
            class="start-button"
            onclick="startGame()">

            CHƠI LẠI

        </button>

    `;


    startScreen.style.display =
        "flex";

}


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener(
    "click",
    startGame
);


// ========================================
// INITIAL DRAW
// ========================================

snake = [

    {
        x: 17,
        y: 17
    },

    {
        x: 16,
        y: 17
    },

    {
        x: 15,
        y: 17
    }

];


createFood();

draw();