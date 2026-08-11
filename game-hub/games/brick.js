const canvas =
    document.getElementById("gameCanvas");

const ctx =
    canvas.getContext("2d");


const scoreElement =
    document.getElementById("score");

const livesElement =
    document.getElementById("lives");

const levelElement =
    document.getElementById("level");

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

let lives = 3;

let level = 1;

let particles = [];

let bricks = [];


// ========================================
// INPUT
// ========================================

const keys = {};

let mouseX =
    WIDTH / 2;


document.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;

        if (
            event.code === "ArrowLeft" ||
            event.code === "ArrowRight"
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        keys[event.code] = false;

    }
);


canvas.addEventListener(
    "mousemove",
    event => {

        const rect =
            canvas.getBoundingClientRect();

        mouseX =
            (event.clientX - rect.left)
            *
            (WIDTH / rect.width);

    }
);


// ========================================
// PADDLE
// ========================================

const paddle = {

    width: 130,

    height: 16,

    x:
        WIDTH / 2 - 65,

    y:
        HEIGHT - 45,

    speed: 9

};


// ========================================
// BALL
// ========================================

const ball = {

    x:
        WIDTH / 2,

    y:
        HEIGHT - 70,

    radius: 9,

    speed: 6,

    dx: 4,

    dy: -4

};


// ========================================
// BRICKS SETTINGS
// ========================================

const brickSettings = {

    rows: 5,

    columns: 9,

    width: 78,

    height: 25,

    padding: 10,

    top: 70

};


// ========================================
// CREATE BRICKS
// ========================================

function createBricks() {

    bricks = [];


    const totalWidth =
        brickSettings.columns *
        brickSettings.width
        +
        (brickSettings.columns - 1) *
        brickSettings.padding;


    const startX =
        (WIDTH - totalWidth) / 2;


    for (
        let row = 0;
        row < brickSettings.rows;
        row++
    ) {

        for (
            let column = 0;
            column <
            brickSettings.columns;
            column++
        ) {

            bricks.push({

                x:
                    startX +
                    column *
                    (
                        brickSettings.width +
                        brickSettings.padding
                    ),

                y:
                    brickSettings.top +
                    row *
                    (
                        brickSettings.height +
                        brickSettings.padding
                    ),

                width:
                    brickSettings.width,

                height:
                    brickSettings.height,

                alive: true,

                hits:
                    Math.floor(
                        row / 2
                    ) + 1

            });

        }

    }

}


// ========================================
// BRICK COLORS
// ========================================

function getBrickColor(
    hits
) {

    if (hits >= 3) {

        return "#e65353";

    }

    if (hits === 2) {

        return "#b45cff";

    }

    return "#ffb52e";

}


// ========================================
// DRAW BRICKS
// ========================================

function drawBricks() {

    bricks.forEach(
        brick => {

            if (!brick.alive) {

                return;

            }


            ctx.fillStyle =
                getBrickColor(
                    brick.hits
                );


            ctx.beginPath();

            ctx.roundRect(
                brick.x,
                brick.y,
                brick.width,
                brick.height,
                5
            );

            ctx.fill();


            ctx.fillStyle =
                "rgba(255,255,255,0.25)";

            ctx.fillRect(
                brick.x + 5,
                brick.y + 4,
                brick.width - 10,
                3
            );


            if (
                brick.hits > 1
            ) {

                ctx.fillStyle =
                    "rgba(0,0,0,0.3)";

                ctx.font =
                    "bold 11px Arial";

                ctx.textAlign =
                    "center";

                ctx.textBaseline =
                    "middle";

                ctx.fillText(
                    brick.hits,
                    brick.x +
                    brick.width / 2,
                    brick.y +
                    brick.height / 2
                );

            }

        }
    );

}


// ========================================
// DRAW PADDLE
// ========================================

function drawPaddle() {

    const gradient =
        ctx.createLinearGradient(
            paddle.x,
            paddle.y,
            paddle.x +
            paddle.width,
            paddle.y
        );


    gradient.addColorStop(
        0,
        "#ffb52e"
    );

    gradient.addColorStop(
        1,
        "#ff6d3d"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();

    ctx.roundRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height,
        8
    );

    ctx.fill();


    ctx.fillStyle =
        "rgba(255,255,255,0.4)";

    ctx.fillRect(
        paddle.x + 12,
        paddle.y + 4,
        paddle.width - 24,
        3
    );

}


// ========================================
// DRAW BALL
// ========================================

function drawBall() {

    ctx.shadowColor =
        "#ffb52e";

    ctx.shadowBlur =
        15;


    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.shadowBlur = 0;

}


// ========================================
// UPDATE PADDLE
// ========================================

function updatePaddle() {

    if (
        keys["ArrowLeft"]
    ) {

        paddle.x -=
            paddle.speed;

    }


    if (
        keys["ArrowRight"]
    ) {

        paddle.x +=
            paddle.speed;

    }


    // Mouse

    if (
        mouseX >= 0 &&
        mouseX <= WIDTH
    ) {

        const targetX =
            mouseX -
            paddle.width / 2;


        if (
            Math.abs(
                targetX -
                paddle.x
            ) > 2
        ) {

            paddle.x +=
                (
                    targetX -
                    paddle.x
                ) * 0.2;

        }

    }


    if (
        paddle.x < 0
    ) {

        paddle.x = 0;

    }


    if (
        paddle.x +
        paddle.width >
        WIDTH
    ) {

        paddle.x =
            WIDTH -
            paddle.width;

    }

}


// ========================================
// UPDATE BALL
// ========================================

function updateBall() {

    ball.x +=
        ball.dx;

    ball.y +=
        ball.dy;


    // Left wall

    if (
        ball.x -
        ball.radius <= 0
    ) {

        ball.x =
            ball.radius;

        ball.dx =
            Math.abs(
                ball.dx
            );

    }


    // Right wall

    if (
        ball.x +
        ball.radius >= WIDTH
    ) {

        ball.x =
            WIDTH -
            ball.radius;

        ball.dx =
            -Math.abs(
                ball.dx
            );

    }


    // Top wall

    if (
        ball.y -
        ball.radius <= 0
    ) {

        ball.y =
            ball.radius;

        ball.dy =
            Math.abs(
                ball.dy
            );

    }


    // Paddle collision

    if (
        ball.dy > 0 &&

        ball.y +
        ball.radius >=
        paddle.y &&

        ball.y -
        ball.radius <=
        paddle.y +
        paddle.height &&

        ball.x >=
        paddle.x &&

        ball.x <=
        paddle.x +
        paddle.width
    ) {

        ball.y =
            paddle.y -
            ball.radius;


        // Tính góc bật dựa trên vị trí va chạm

        const hitPosition =
            (
                ball.x -
                (
                    paddle.x +
                    paddle.width / 2
                )
            )
            /
            (
                paddle.width / 2
            );


        const angle =
            hitPosition *
            Math.PI /
            3;


        const speed =
            Math.sqrt(
                ball.dx *
                ball.dx +
                ball.dy *
                ball.dy
            );


        ball.dx =
            speed *
            Math.sin(angle);

        ball.dy =
            -Math.abs(
                speed *
                Math.cos(angle)
            );

    }


    // Ball rơi

    if (
        ball.y -
        ball.radius >
        HEIGHT
    ) {

        loseLife();

    }

}


// ========================================
// BRICK COLLISION
// ========================================

function checkBrickCollision() {

    for (
        let i = 0;
        i < bricks.length;
        i++
    ) {

        const brick =
            bricks[i];


        if (!brick.alive) {

            continue;

        }


        if (

            ball.x +
            ball.radius >
            brick.x &&

            ball.x -
            ball.radius <
            brick.x +
            brick.width &&

            ball.y +
            ball.radius >
            brick.y &&

            ball.y -
            ball.radius <
            brick.y +
            brick.height

        ) {

            brick.hits--;


            createParticles(
                ball.x,
                ball.y,
                getBrickColor(
                    brick.hits + 1
                )
            );


            // Đổi hướng bóng

            const previousX =
                ball.x -
                ball.dx;

            const previousY =
                ball.y -
                ball.dy;


            if (
                previousX <
                brick.x ||
                previousX >
                brick.x +
                brick.width
            ) {

                ball.dx *= -1;

            }

            else {

                ball.dy *= -1;

            }


            if (
                brick.hits <= 0
            ) {

                brick.alive = false;

                score += 10;

            }

            else {

                score += 5;

            }


            scoreElement.textContent =
                score;


            checkLevelComplete();


            break;

        }

    }

}


// ========================================
// LEVEL COMPLETE
// ========================================

function checkLevelComplete() {

    const remaining =
        bricks.filter(
            brick =>
                brick.alive
        ).length;


    if (
        remaining === 0
    ) {

        level++;

        levelElement.textContent =
            level;


        createLevel();

    }

}


// ========================================
// CREATE LEVEL
// ========================================

function createLevel() {

    brickSettings.rows =
        Math.min(
            5 + level - 1,
            8
        );


    createBricks();


    ball.x =
        WIDTH / 2;

    ball.y =
        HEIGHT - 70;


    const speed =
        Math.min(
            6 + level * 0.5,
            10
        );


    const direction =
        ball.dx >= 0
            ? 1
            : -1;


    ball.dx =
        direction *
        speed *
        0.65;


    ball.dy =
        -speed *
        0.75;

}


// ========================================
// LOSE LIFE
// ========================================

function loseLife() {

    lives--;


    livesElement.textContent =
        lives;


    if (
        lives <= 0
    ) {

        gameOver();

        return;

    }


    ball.x =
        WIDTH / 2;

    ball.y =
        HEIGHT - 70;


    const speed =
        Math.min(
            6 + level * 0.5,
            10
        );


    ball.dx =
        (
            Math.random() > 0.5
                ? 1
                : -1
        )
        *
        speed *
        0.65;


    ball.dy =
        -speed *
        0.75;


    paddle.x =
        WIDTH / 2 -
        paddle.width / 2;

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

function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            HEIGHT
        );


    gradient.addColorStop(
        0,
        "#10182d"
    );

    gradient.addColorStop(
        1,
        "#080a11"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Background grid

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;


    for (
        let x = 0;
        x < WIDTH;
        x += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            HEIGHT
        );

        ctx.stroke();

    }


    for (
        let y = 0;
        y < HEIGHT;
        y += 50
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            y
        );

        ctx.lineTo(
            WIDTH,
            y
        );

        ctx.stroke();

    }

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


    updatePaddle();

    updateBall();

    checkBrickCollision();

    updateParticles();


    drawBackground();

    drawBricks();

    drawPaddle();

    drawBall();

    drawParticles();


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

    lives = 3;

    level = 1;

    particles = [];


    scoreElement.textContent =
        "0";

    livesElement.textContent =
        "3";

    levelElement.textContent =
        "1";


    brickSettings.rows = 5;


    paddle.x =
        WIDTH / 2 -
        paddle.width / 2;


    ball.x =
        WIDTH / 2;

    ball.y =
        HEIGHT - 70;

    ball.dx = 4;

    ball.dy = -5;


    createBricks();


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
            Bạn đã hết mạng.<br>
            Điểm:
            <strong>${score}</strong>
            &nbsp; | &nbsp;
            Level:
            <strong>${level}</strong>
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