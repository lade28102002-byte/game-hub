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

let bestScore =
    Number(
        localStorage.getItem(
            "flappyBest"
        )
    ) || 0;

let pipes = [];

let particles = [];

let clouds = [];

let pipeTimer = 0;


// ========================================
// BIRD
// ========================================

const bird = {

    x: 180,

    y: HEIGHT / 2,

    width: 38,

    height: 30,

    velocity: 0,

    gravity: 0.45,

    jump: -8,

    rotation: 0

};


// ========================================
// PIPE SETTINGS
// ========================================

const pipeWidth = 75;

const pipeGap = 165;

const pipeSpeed = 3.2;


// ========================================
// DISPLAY BEST SCORE
// ========================================

bestElement.textContent =
    bestScore;


// ========================================
// INPUT
// ========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            flap();

        }

    }
);


canvas.addEventListener(
    "mousedown",
    () => {

        flap();

    }
);


canvas.addEventListener(
    "touchstart",
    event => {

        event.preventDefault();

        flap();

    }
);


function flap() {

    if (
        !gameRunning
    ) {

        return;

    }


    bird.velocity =
        bird.jump;


    createFlapParticles();

}


// ========================================
// CREATE CLOUDS
// ========================================

function createClouds() {

    clouds = [];


    for (
        let i = 0;
        i < 7;
        i++
    ) {

        clouds.push({

            x:
                Math.random() *
                WIDTH,

            y:
                50 +
                Math.random() *
                230,

            width:
                60 +
                Math.random() *
                80,

            speed:
                0.25 +
                Math.random() *
                0.4

        });

    }

}


// ========================================
// UPDATE CLOUDS
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
                    WIDTH +
                    Math.random() *
                    100;

                cloud.y =
                    50 +
                    Math.random() *
                    230;

            }

        }
    );

}


// ========================================
// DRAW CLOUDS
// ========================================

function drawClouds() {

    ctx.fillStyle =
        "rgba(255,255,255,0.7)";


    clouds.forEach(
        cloud => {

            ctx.beginPath();

            ctx.arc(
                cloud.x + 25,
                cloud.y + 20,
                20,
                0,
                Math.PI * 2
            );

            ctx.arc(
                cloud.x + 50,
                cloud.y + 10,
                25,
                0,
                Math.PI * 2
            );

            ctx.arc(
                cloud.x + 80,
                cloud.y + 20,
                20,
                0,
                Math.PI * 2
            );

            ctx.fillRect(
                cloud.x + 20,
                cloud.y + 20,
                cloud.width - 35,
                25
            );

            ctx.fill();

        }
    );

}


// ========================================
// CREATE PIPE
// ========================================

function createPipe() {

    const minTop =
        70;

    const maxTop =
        HEIGHT -
        pipeGap -
        100;


    const topHeight =
        minTop +
        Math.random() *
        (
            maxTop -
            minTop
        );


    pipes.push({

        x:
            WIDTH + 20,

        top:
            topHeight,

        bottom:
            topHeight +
            pipeGap,

        width:
            pipeWidth,

        passed:
            false

    });

}


// ========================================
// DRAW PIPE
// ========================================

function drawPipe(
    pipe
) {

    const gradient =
        ctx.createLinearGradient(
            pipe.x,
            0,
            pipe.x +
            pipe.width,
            0
        );


    gradient.addColorStop(
        0,
        "#4aa83d"
    );

    gradient.addColorStop(
        0.5,
        "#70c957"
    );

    gradient.addColorStop(
        1,
        "#368b32"
    );


    ctx.fillStyle =
        gradient;


    // Top pipe

    ctx.fillRect(
        pipe.x,
        0,
        pipe.width,
        pipe.top
    );


    // Top pipe cap

    ctx.fillStyle =
        "#5ab64b";

    ctx.fillRect(
        pipe.x - 6,
        pipe.top - 25,
        pipe.width + 12,
        25
    );


    // Bottom pipe

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        pipe.x,
        pipe.bottom,
        pipe.width,
        HEIGHT -
        pipe.bottom
    );


    // Bottom pipe cap

    ctx.fillStyle =
        "#5ab64b";

    ctx.fillRect(
        pipe.x - 6,
        pipe.bottom,
        pipe.width + 12,
        25
    );


    // Highlight

    ctx.fillStyle =
        "rgba(255,255,255,0.18)";

    ctx.fillRect(
        pipe.x + 8,
        0,
        8,
        pipe.top - 25
    );


    ctx.fillRect(
        pipe.x + 8,
        pipe.bottom + 25,
        8,
        HEIGHT -
        pipe.bottom -
        25
    );

}


// ========================================
// UPDATE PIPES
// ========================================

function updatePipes() {

    pipeTimer++;


    if (
        pipeTimer >= 100
    ) {

        createPipe();

        pipeTimer = 0;

    }


    pipes.forEach(
        pipe => {

            pipe.x -=
                pipeSpeed;


            if (
                !pipe.passed &&
                pipe.x +
                pipe.width <
                bird.x
            ) {

                pipe.passed =
                    true;

                score++;

                scoreElement.textContent =
                    score;


                createScoreParticles();

            }

        }
    );


    pipes =
        pipes.filter(
            pipe =>
                pipe.x +
                pipe.width >
                -20
        );

}


// ========================================
// UPDATE BIRD
// ========================================

function updateBird() {

    bird.velocity +=
        bird.gravity;


    bird.y +=
        bird.velocity;


    bird.rotation =
        Math.min(
            bird.velocity *
            0.08,
            0.6
        );


    if (
        bird.y < 0
    ) {

        bird.y = 0;

        bird.velocity = 0;

    }


    if (
        bird.y +
        bird.height >
        HEIGHT - 55
    ) {

        gameOver();

    }

}


// ========================================
// DRAW BIRD
// ========================================

function drawBird() {

    ctx.save();


    ctx.translate(
        bird.x +
        bird.width / 2,
        bird.y +
        bird.height / 2
    );


    ctx.rotate(
        bird.rotation
    );


    // Body

    ctx.fillStyle =
        "#ffd23f";

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        20,
        15,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Wing

    ctx.fillStyle =
        "#e8ad24";

    ctx.beginPath();

    ctx.ellipse(
        -5,
        7,
        11,
        6,
        -0.3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Eye

    ctx.fillStyle =
        "white";

    ctx.beginPath();

    ctx.arc(
        10,
        -6,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle =
        "#111";

    ctx.beginPath();

    ctx.arc(
        12,
        -6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Beak

    ctx.fillStyle =
        "#f47d30";

    ctx.beginPath();

    ctx.moveTo(
        17,
        0
    );

    ctx.lineTo(
        32,
        5
    );

    ctx.lineTo(
        17,
        9
    );

    ctx.closePath();

    ctx.fill();


    ctx.restore();

}


// ========================================
// COLLISION
// ========================================

function checkCollision() {

    const padding = 5;


    const birdLeft =
        bird.x +
        padding;

    const birdRight =
        bird.x +
        bird.width -
        padding;

    const birdTop =
        bird.y +
        padding;

    const birdBottom =
        bird.y +
        bird.height -
        padding;


    for (
        const pipe of pipes
    ) {

        const pipeLeft =
            pipe.x;

        const pipeRight =
            pipe.x +
            pipe.width;


        const hitPipe =
            birdRight >
            pipeLeft &&

            birdLeft <
            pipeRight &&

            (
                birdTop <
                pipe.top ||

                birdBottom >
                pipe.bottom
            );


        if (
            hitPipe
        ) {

            gameOver();

            return;

        }

    }

}


// ========================================
// GROUND
// ========================================

function drawGround() {

    ctx.fillStyle =
        "#ded895";

    ctx.fillRect(
        0,
        HEIGHT - 55,
        WIDTH,
        55
    );


    ctx.fillStyle =
        "#8ac34a";

    ctx.fillRect(
        0,
        HEIGHT - 60,
        WIDTH,
        10
    );


    // Ground pattern

    ctx.fillStyle =
        "#c6be7c";


    for (
        let x = -20;
        x < WIDTH;
        x += 40
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            HEIGHT - 50
        );

        ctx.lineTo(
            x + 20,
            HEIGHT - 40
        );

        ctx.lineTo(
            x + 40,
            HEIGHT - 50
        );

        ctx.closePath();

        ctx.fill();

    }

}


// ========================================
// PARTICLES
// ========================================

function createFlapParticles() {

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        particles.push({

            x:
                bird.x,

            y:
                bird.y +
                bird.height / 2,

            size:
                Math.random() *
                4 +
                2,

            speedX:
                -Math.random() *
                2,

            speedY:
                (
                    Math.random() -
                    0.5
                ) * 2,

            life: 15,

            color:
                "#ffffff"

        });

    }

}


function createScoreParticles() {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        particles.push({

            x:
                bird.x,

            y:
                bird.y,

            size:
                Math.random() *
                3 +
                2,

            speedX:
                (
                    Math.random() -
                    0.5
                ) * 3,

            speedY:
                (
                    Math.random() -
                    0.5
                ) * 3,

            life: 25,

            color:
                "#ffd23f"

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

            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );

            ctx.fill();

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
        "#65c9ed"
    );

    gradient.addColorStop(
        1,
        "#b6e8f4"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    drawClouds();

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


    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    updateClouds();

    updateBird();

    updatePipes();

    updateParticles();


    checkCollision();


    drawBackground();

    drawPipes();

    drawGround();

    drawBird();

    drawParticles();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ========================================
// DRAW ALL PIPES
// ========================================

function drawPipes() {

    pipes.forEach(
        pipe => {

            drawPipe(
                pipe
            );

        }
    );

}


// ========================================
// START GAME
// ========================================

function startGame() {

    score = 0;

    pipes = [];

    particles = [];

    pipeTimer = 0;


    scoreElement.textContent =
        "0";


    bird.x = 180;

    bird.y =
        HEIGHT / 2;

    bird.velocity = 0;

    bird.rotation = 0;


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

    if (
        !gameRunning
    ) {

        return;

    }


    gameRunning = false;


    if (
        score >
        bestScore
    ) {

        bestScore =
            score;


        localStorage.setItem(
            "flappyBest",
            bestScore
        );

    }


    bestElement.textContent =
        bestScore;


    cancelAnimationFrame(
        animationId
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


startButton.addEventListener(
    "click",
    startGame
);