const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const scoreElement =
    document.getElementById("score");

const coinsElement =
    document.getElementById("coins");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");


const WIDTH =
    canvas.width;

const HEIGHT =
    canvas.height;


// ========================================
// GAME STATE
// ========================================

let gameRunning = false;

let animationId;

let score = 0;

let coins = 0;

let gameSpeed = 6;

let distance = 0;

let obstacleTimer = 0;

let coinTimer = 0;


// ========================================
// WORLD
// ========================================

const groundY = 450;


// ========================================
// PLAYER
// ========================================

const player = {

    x: 160,

    y: groundY - 70,

    width: 45,

    height: 70,

    velocityY: 0,

    gravity: 0.75,

    jumpPower: -14,

    onGround: true

};


// ========================================
// OBJECTS
// ========================================

let obstacles = [];

let coinsList = [];

let particles = [];

let clouds = [];


// ========================================
// INITIALIZE CLOUDS
// ========================================

function createClouds() {

    clouds = [];

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        clouds.push({

            x:
                Math.random() *
                WIDTH,

            y:
                Math.random() *
                220,

            width:
                Math.random() * 70 +
                60,

            speed:
                Math.random() * 0.3 +
                0.2

        });

    }

}


// ========================================
// INPUT
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" ||
            event.code === "ArrowUp"
        ) {

            event.preventDefault();

            if (gameRunning) {

                jump();

            }

        }

    }
);


canvas.addEventListener(
    "click",
    () => {

        if (gameRunning) {

            jump();

        }

    }
);


// ========================================
// JUMP
// ========================================

function jump() {

    if (
        player.onGround
    ) {

        player.velocityY =
            player.jumpPower;

        player.onGround =
            false;

    }

}


// ========================================
// PLAYER UPDATE
// ========================================

function updatePlayer() {

    player.velocityY +=
        player.gravity;

    player.y +=
        player.velocityY;


    if (
        player.y +
        player.height >=
        groundY
    ) {

        player.y =
            groundY -
            player.height;

        player.velocityY = 0;

        player.onGround = true;

    }

}


// ========================================
// DRAW PLAYER
// ========================================

function drawPlayer() {

    const x =
        player.x;

    const y =
        player.y;


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        x + 22,
        groundY + 5,
        30,
        7,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Legs

    ctx.fillStyle =
        "#1c1d28";

    ctx.fillRect(
        x + 8,
        y + 48,
        10,
        22
    );

    ctx.fillRect(
        x + 28,
        y + 48,
        10,
        22
    );


    // Body

    ctx.fillStyle =
        "#242633";

    ctx.fillRect(
        x + 6,
        y + 23,
        34,
        32
    );


    // Head

    ctx.fillStyle =
        "#f0b58f";

    ctx.beginPath();

    ctx.arc(
        x + 23,
        y + 16,
        16,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Ninja mask

    ctx.fillStyle =
        "#171821";

    ctx.fillRect(
        x + 8,
        y + 9,
        30,
        12
    );


    // Eye

    ctx.fillStyle =
        "#a855f7";

    ctx.fillRect(
        x + 28,
        y + 12,
        5,
        3
    );


    // Scarf

    ctx.fillStyle =
        "#a855f7";

    ctx.fillRect(
        x + 3,
        y + 25,
        13,
        7
    );


    // Sword

    ctx.strokeStyle =
        "#d8dce8";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        x + 38,
        y + 35
    );

    ctx.lineTo(
        x + 60,
        y + 12
    );

    ctx.stroke();

}


// ========================================
// OBSTACLES
// ========================================

function createObstacle() {

    const type =
        Math.random() < 0.7
            ? "rock"
            : "spike";


    if (
        type === "rock"
    ) {

        obstacles.push({

            x: WIDTH + 30,

            y: groundY - 45,

            width:
                Math.random() * 25 +
                35,

            height: 45,

            type: "rock"

        });

    }

    else {

        obstacles.push({

            x: WIDTH + 30,

            y: groundY - 45,

            width: 40,

            height: 45,

            type: "spike"

        });

    }

}


function updateObstacles() {

    obstacleTimer++;


    const spawnRate =
        Math.max(
            55,
            105 -
            Math.floor(
                score / 200
            )
        );


    if (
        obstacleTimer >=
        spawnRate
    ) {

        createObstacle();

        obstacleTimer = 0;

    }


    obstacles.forEach(
        obstacle => {

            obstacle.x -=
                gameSpeed;

        }
    );


    obstacles =
        obstacles.filter(
            obstacle =>
                obstacle.x +
                obstacle.width >
                -50
        );

}


function drawObstacles() {

    obstacles.forEach(
        obstacle => {

            if (
                obstacle.type ===
                "rock"
            ) {

                ctx.fillStyle =
                    "#5b5e6b";

                ctx.beginPath();

                ctx.moveTo(
                    obstacle.x,
                    groundY
                );

                ctx.lineTo(
                    obstacle.x + 8,
                    obstacle.y + 10
                );

                ctx.lineTo(
                    obstacle.x + 25,
                    obstacle.y
                );

                ctx.lineTo(
                    obstacle.x +
                    obstacle.width,
                    obstacle.y + 12
                );

                ctx.lineTo(
                    obstacle.x +
                    obstacle.width,
                    groundY
                );

                ctx.closePath();

                ctx.fill();

            }

            else {

                ctx.fillStyle =
                    "#e85062";

                ctx.beginPath();

                ctx.moveTo(
                    obstacle.x,
                    groundY
                );

                ctx.lineTo(
                    obstacle.x +
                    obstacle.width / 2,
                    obstacle.y
                );

                ctx.lineTo(
                    obstacle.x +
                    obstacle.width,
                    groundY
                );

                ctx.closePath();

                ctx.fill();

            }

        }
    );

}


// ========================================
// COINS
// ========================================

function createCoin() {

    coinsList.push({

        x: WIDTH + 30,

        y:
            groundY -
            Math.random() * 180 -
            50,

        radius: 12,

        rotation: 0

    });

}


function updateCoins() {

    coinTimer++;


    if (
        coinTimer >= 85
    ) {

        createCoin();

        coinTimer = 0;

    }


    coinsList.forEach(
        coin => {

            coin.x -=
                gameSpeed;

            coin.rotation +=
                0.1;

        }
    );


    coinsList =
        coinsList.filter(
            coin =>
                coin.x >
                -30
        );

}


function drawCoins() {

    coinsList.forEach(
        coin => {

            ctx.save();

            ctx.translate(
                coin.x,
                coin.y
            );

            ctx.scale(
                Math.cos(
                    coin.rotation
                ),
                1
            );


            ctx.fillStyle =
                "#ffd34e";

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                coin.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.fillStyle =
                "#a76d00";

            ctx.font =
                "bold 14px Arial";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                "$",
                0,
                1
            );


            ctx.restore();

        }
    );

}


// ========================================
// COLLISION
// ========================================

function collision(
    a,
    b
) {

    const padding = 7;


    return (

        a.x +
        padding <
        b.x +
        b.width &&

        a.x +
        a.width -
        padding >
        b.x &&

        a.y +
        padding <
        b.y +
        b.height &&

        a.y +
        a.height -
        padding >
        b.y

    );

}


function coinCollision(
    player,
    coin
) {

    const closestX =
        Math.max(
            player.x,
            Math.min(
                coin.x,
                player.x +
                player.width
            )
        );


    const closestY =
        Math.max(
            player.y,
            Math.min(
                coin.y,
                player.y +
                player.height
            )
        );


    const dx =
        coin.x -
        closestX;

    const dy =
        coin.y -
        closestY;


    return (
        dx * dx +
        dy * dy <
        coin.radius *
        coin.radius
    );

}


// ========================================
// CHECK COLLISIONS
// ========================================

function checkCollisions() {

    for (
        let i = 0;
        i < obstacles.length;
        i++
    ) {

        if (
            collision(
                player,
                obstacles[i]
            )
        ) {

            gameOver();

            return;

        }

    }


    for (
        let i =
            coinsList.length - 1;
        i >= 0;
        i--
    ) {

        if (
            coinCollision(
                player,
                coinsList[i]
            )
        ) {

            createParticles(
                coinsList[i].x,
                coinsList[i].y,
                "#ffd34e"
            );


            coins++;

            score += 25;


            coinsElement.textContent =
                coins;

            scoreElement.textContent =
                score;


            coinsList.splice(
                i,
                1
            );

        }

    }

}


// ========================================
// PARTICLES
// ========================================

function createParticles(
    x,
    y,
    color
) {

    for (
        let i = 0;
        i < 10;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            size:
                Math.random() * 4 + 2,

            speedX:
                (Math.random() - 0.5) * 5,

            speedY:
                (Math.random() - 0.5) * 5,

            life: 25,

            color: color

        });

    }

}


function updateParticles() {

    particles.forEach(
        particle => {

            particle.x +=
                particle.speedX;

            particle.y +=
                particle.speedY;

            particle.life--;

        }
    );


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );

}


function drawParticles() {

    particles.forEach(
        particle => {

            ctx.globalAlpha =
                particle.life / 25;

            ctx.fillStyle =
                particle.color;

            ctx.fillRect(
                particle.x,
                particle.y,
                particle.size,
                particle.size
            );

        }
    );

    ctx.globalAlpha = 1;

}


// ========================================
// BACKGROUND
// ========================================

function updateClouds() {

    clouds.forEach(
        cloud => {

            cloud.x -=
                cloud.speed;

            if (
                cloud.x +
                cloud.width <
                0
            ) {

                cloud.x =
                    WIDTH + 50;

            }

        }
    );

}


function drawBackground() {

    // Sky

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    gradient.addColorStop(
        0,
        "#11152d"
    );

    gradient.addColorStop(
        1,
        "#2a1742"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Moon

    ctx.fillStyle =
        "#f5edc9";

    ctx.beginPath();

    ctx.arc(
        820,
        100,
        40,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Clouds

    ctx.fillStyle =
        "rgba(255,255,255,0.08)";


    clouds.forEach(
        cloud => {

            ctx.beginPath();

            ctx.arc(
                cloud.x,
                cloud.y,
                25,
                0,
                Math.PI * 2
            );

            ctx.arc(
                cloud.x + 30,
                cloud.y - 8,
                30,
                0,
                Math.PI * 2
            );

            ctx.arc(
                cloud.x + 60,
                cloud.y,
                22,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );


    // Mountains

    ctx.fillStyle =
        "#17162b";

    ctx.beginPath();

    ctx.moveTo(
        0,
        groundY
    );

    for (
        let x = 0;
        x <= WIDTH;
        x += 100
    ) {

        const height =
            70 +
            Math.sin(
                x * 0.02
            ) * 50;

        ctx.lineTo(
            x,
            groundY - height
        );

    }

    ctx.lineTo(
        WIDTH,
        groundY
    );

    ctx.closePath();

    ctx.fill();


    // Ground

    ctx.fillStyle =
        "#171b21";

    ctx.fillRect(
        0,
        groundY,
        WIDTH,
        HEIGHT - groundY
    );


    // Ground line

    ctx.fillStyle =
        "#a855f7";

    ctx.fillRect(
        0,
        groundY,
        WIDTH,
        4
    );

}


// ========================================
// GAME SPEED
// ========================================

function updateDifficulty() {

    gameSpeed =
        6 +
        Math.floor(
            score / 150
        ) * 0.5;

}


// ========================================
// GAME LOOP
// ========================================

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


    updateDifficulty();

    updatePlayer();

    updateObstacles();

    updateCoins();

    updateClouds();

    updateParticles();

    checkCollisions();


    drawBackground();

    drawObstacles();

    drawCoins();

    drawPlayer();

    drawParticles();


    distance +=
        gameSpeed;


    score =
        Math.floor(
            distance / 100
        ) +
        coins * 25;


    scoreElement.textContent =
        score;


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ========================================
// START GAME
// ========================================

function startGame() {

    score = 0;

    coins = 0;

    distance = 0;

    gameSpeed = 6;

    obstacleTimer = 0;

    coinTimer = 0;


    obstacles = [];

    coinsList = [];

    particles = [];


    player.y =
        groundY -
        player.height;

    player.velocityY = 0;

    player.onGround = true;


    scoreElement.textContent =
        "0";

    coinsElement.textContent =
        "0";


    createClouds();


    gameRunning = true;


    startScreen.style.display =
        "none";


    cancelAnimationFrame(
        animationId
    );


    gameLoop();

}


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    startScreen.innerHTML = `

        <h2>GAME OVER</h2>

        <p>
            Bạn đã va phải chướng ngại vật.<br>
            Điểm:
            <strong>${score}</strong>
            &nbsp; | &nbsp;
            Xu:
            <strong>${coins}</strong>
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