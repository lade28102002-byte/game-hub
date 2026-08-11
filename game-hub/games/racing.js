const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let gameRunning = false;
let animationId;

let score = 0;
let speed = 5;

let roadOffset = 0;
let enemyTimer = 0;

const keys = {};


// ==============================
// PLAYER
// ==============================

const player = {
    x: WIDTH / 2 - 25,
    y: HEIGHT - 130,

    width: 50,
    height: 90,

    speed: 7
};


// ==============================
// ENEMIES
// ==============================

let enemies = [];


// ==============================
// KEYBOARD
// ==============================

document.addEventListener("keydown", event => {

    keys[event.code] = true;

    if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight"
    ) {
        event.preventDefault();
    }

});


document.addEventListener("keyup", event => {

    keys[event.code] = false;

});


// ==============================
// ROAD
// ==============================

function drawRoad() {

    // Background

    ctx.fillStyle = "#1c5a2d";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Road

    const roadWidth = 420;

    const roadX =
        WIDTH / 2 - roadWidth / 2;

    ctx.fillStyle = "#33363a";

    ctx.fillRect(
        roadX,
        0,
        roadWidth,
        HEIGHT
    );


    // Road borders

    ctx.fillStyle = "#eeeeee";

    ctx.fillRect(
        roadX,
        0,
        6,
        HEIGHT
    );

    ctx.fillRect(
        roadX + roadWidth - 6,
        0,
        6,
        HEIGHT
    );


    // Lane lines

    ctx.fillStyle = "#ffffff";

    const laneWidth = roadWidth / 3;

    roadOffset += speed;

    if (roadOffset > 60) {
        roadOffset = 0;
    }


    for (let lane = 1; lane < 3; lane++) {

        const x =
            roadX + lane * laneWidth;

        for (
            let y = -60 + roadOffset;
            y < HEIGHT;
            y += 100
        ) {

            ctx.fillRect(
                x - 3,
                y,
                6,
                55
            );

        }

    }

}


// ==============================
// PLAYER CAR
// ==============================

function drawPlayer() {

    const x = player.x;
    const y = player.y;


    // Shadow

    ctx.fillStyle = "rgba(0,0,0,0.35)";

    ctx.fillRect(
        x + 5,
        y + 8,
        player.width,
        player.height
    );


    // Car body

    ctx.fillStyle = "#ff3d81";

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        player.width,
        player.height,
        10
    );

    ctx.fill();


    // Windows

    ctx.fillStyle = "#9ee7ff";

    ctx.fillRect(
        x + 9,
        y + 13,
        32,
        25
    );


    // Window divider

    ctx.fillStyle = "#30343b";

    ctx.fillRect(
        x + 23,
        y + 13,
        4,
        25
    );


    // Front

    ctx.fillStyle = "#ffdb72";

    ctx.fillRect(
        x + 7,
        y + 4,
        10,
        5
    );

    ctx.fillRect(
        x + 33,
        y + 4,
        10,
        5
    );


    // Back lights

    ctx.fillStyle = "#ff2222";

    ctx.fillRect(
        x + 6,
        y + player.height - 10,
        10,
        5
    );

    ctx.fillRect(
        x + 34,
        y + player.height - 10,
        10,
        5
    );


    // Wheels

    ctx.fillStyle = "#111";

    ctx.fillRect(
        x - 5,
        y + 15,
        7,
        22
    );

    ctx.fillRect(
        x + player.width - 2,
        y + 15,
        7,
        22
    );

    ctx.fillRect(
        x - 5,
        y + 55,
        7,
        22
    );

    ctx.fillRect(
        x + player.width - 2,
        y + 55,
        7,
        22
    );

}


// ==============================
// PLAYER MOVEMENT
// ==============================

function updatePlayer() {

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;

    }

    if (keys["ArrowRight"]) {

        player.x += player.speed;

    }


    const roadWidth = 420;

    const roadX =
        WIDTH / 2 -
        roadWidth / 2;


    if (player.x < roadX + 10) {

        player.x = roadX + 10;

    }


    if (
        player.x +
        player.width >
        roadX + roadWidth - 10
    ) {

        player.x =
            roadX +
            roadWidth -
            player.width -
            10;

    }

}


// ==============================
// ENEMY CARS
// ==============================

function createEnemy() {

    const roadWidth = 420;

    const roadX =
        WIDTH / 2 -
        roadWidth / 2;


    const laneWidth =
        roadWidth / 3;


    const lane =
        Math.floor(
            Math.random() * 3
        );


    const width = 50;
    const height = 90;


    const x =
        roadX +
        lane * laneWidth +
        laneWidth / 2 -
        width / 2;


    enemies.push({

        x: x,

        y: -height - 20,

        width: width,

        height: height,

        speed:
            speed +
            Math.random() * 2,

        color:
            randomCarColor()

    });

}


function randomCarColor() {

    const colors = [
        "#32a8ff",
        "#ffbd32",
        "#51d66b",
        "#9b5cff",
        "#ff5c5c",
        "#ffffff"
    ];

    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];

}


function drawEnemy(enemy) {

    const x = enemy.x;
    const y = enemy.y;


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.3)";

    ctx.fillRect(
        x + 5,
        y + 7,
        enemy.width,
        enemy.height
    );


    // Body

    ctx.fillStyle =
        enemy.color;

    ctx.beginPath();

    ctx.roundRect(
        x,
        y,
        enemy.width,
        enemy.height,
        10
    );

    ctx.fill();


    // Windows

    ctx.fillStyle = "#242a33";

    ctx.fillRect(
        x + 9,
        y + 14,
        32,
        25
    );


    // Lights

    ctx.fillStyle = "#ff2222";

    ctx.fillRect(
        x + 7,
        y + enemy.height - 10,
        10,
        5
    );

    ctx.fillRect(
        x + 33,
        y + enemy.height - 10,
        10,
        5
    );


    // Wheels

    ctx.fillStyle = "#111";

    ctx.fillRect(
        x - 5,
        y + 15,
        7,
        22
    );

    ctx.fillRect(
        x + enemy.width - 2,
        y + 15,
        7,
        22
    );

    ctx.fillRect(
        x - 5,
        y + 55,
        7,
        22
    );

    ctx.fillRect(
        x + enemy.width - 2,
        y + 55,
        7,
        22
    );

}


function updateEnemies() {

    enemyTimer++;


    const spawnRate =
        Math.max(
            30,
            70 - Math.floor(score / 100)
        );


    if (enemyTimer >= spawnRate) {

        createEnemy();

        enemyTimer = 0;

    }


    enemies.forEach(enemy => {

        enemy.y += enemy.speed;

    });


    enemies =
        enemies.filter(enemy => {

            if (enemy.y > HEIGHT) {

                score += 10;

                scoreElement.textContent =
                    score;

                return false;

            }

            return true;

        });

}


// ==============================
// COLLISION
// ==============================

function checkCollision(a, b) {

    const padding = 8;

    return (

        a.x + padding <
        b.x + b.width - padding &&

        a.x +
        a.width -
        padding >
        b.x + padding &&

        a.y + padding <
        b.y + b.height - padding &&

        a.y +
        a.height -
        padding >
        b.y + padding

    );

}


function checkCollisions() {

    for (const enemy of enemies) {

        if (
            checkCollision(
                player,
                enemy
            )
        ) {

            gameOver();

            return;

        }

    }

}


// ==============================
// DIFFICULTY
// ==============================

function updateDifficulty() {

    speed =
        5 +
        Math.floor(score / 150) * 0.5;

}


// ==============================
// GAME LOOP
// ==============================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    drawRoad();

    updatePlayer();

    updateEnemies();

    updateDifficulty();

    checkCollisions();


    drawPlayer();

    enemies.forEach(drawEnemy);


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ==============================
// START
// ==============================

function startGame() {

    score = 0;

    speed = 5;

    enemyTimer = 0;

    roadOffset = 0;

    enemies = [];


    scoreElement.textContent =
        score;


    player.x =
        WIDTH / 2 -
        player.width / 2;


    player.y =
        HEIGHT - 130;


    gameRunning = true;


    startScreen.style.display =
        "none";


    cancelAnimationFrame(
        animationId
    );


    gameLoop();

}


// ==============================
// GAME OVER
// ==============================

function gameOver() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    startScreen.innerHTML = `

        <h2>GAME OVER</h2>

        <p>
            Điểm của bạn:
            <strong>${score}</strong>
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


startButton.addEventListener(
    "click",
    startGame
);