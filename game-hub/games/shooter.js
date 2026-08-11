const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");

const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");


// ========================================
// GAME SETTINGS
// ========================================

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let gameRunning = false;

let score = 0;

let animationId;


// ========================================
// PLAYER
// ========================================

const player = {

    x: WIDTH / 2 - 25,

    y: HEIGHT - 80,

    width: 50,

    height: 45,

    speed: 6

};


// ========================================
// GAME OBJECTS
// ========================================

let bullets = [];

let enemies = [];

let particles = [];

let stars = [];


// ========================================
// KEYBOARD
// ========================================

const keys = {};

document.addEventListener("keydown", function(event) {

    keys[event.code] = true;

    if (
        event.code === "Space" &&
        gameRunning
    ) {

        shoot();

        event.preventDefault();

    }

});


document.addEventListener("keyup", function(event) {

    keys[event.code] = false;

});


// ========================================
// STAR BACKGROUND
// ========================================

function createStars() {

    stars = [];

    for (let i = 0; i < 100; i++) {

        stars.push({

            x: Math.random() * WIDTH,

            y: Math.random() * HEIGHT,

            size: Math.random() * 2 + 0.5,

            speed: Math.random() * 1.5 + 0.3

        });

    }

}


function updateStars() {

    stars.forEach(star => {

        star.y += star.speed;

        if (star.y > HEIGHT) {

            star.y = 0;

            star.x = Math.random() * WIDTH;

        }

    });

}


function drawStars() {

    ctx.fillStyle = "#ffffff";

    stars.forEach(star => {

        ctx.globalAlpha = Math.random() * 0.6 + 0.3;

        ctx.fillRect(
            star.x,
            star.y,
            star.size,
            star.size
        );

    });

    ctx.globalAlpha = 1;

}


// ========================================
// PLAYER
// ========================================

function updatePlayer() {

    if (keys["ArrowLeft"]) {

        player.x -= player.speed;

    }

    if (keys["ArrowRight"]) {

        player.x += player.speed;

    }


    if (keys["ArrowUp"]) {

        player.y -= player.speed;

    }

    if (keys["ArrowDown"]) {

        player.y += player.speed;

    }


    // Không cho phi thuyền ra ngoài màn hình

    if (player.x < 0) {

        player.x = 0;

    }

    if (player.x + player.width > WIDTH) {

        player.x =
            WIDTH - player.width;

    }

    if (player.y < HEIGHT / 2) {

        player.y = HEIGHT / 2;

    }

    if (player.y + player.height > HEIGHT) {

        player.y =
            HEIGHT - player.height;

    }

}


function drawPlayer() {

    const x = player.x;
    const y = player.y;


    // Thân phi thuyền

    ctx.fillStyle = "#ff3d81";

    ctx.beginPath();

    ctx.moveTo(
        x + player.width / 2,
        y
    );

    ctx.lineTo(
        x,
        y + player.height
    );

    ctx.lineTo(
        x + player.width,
        y + player.height
    );

    ctx.closePath();

    ctx.fill();


    // Buồng lái

    ctx.fillStyle = "#62d9ff";

    ctx.beginPath();

    ctx.arc(
        x + player.width / 2,
        y + 20,
        8,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Động cơ

    ctx.fillStyle = "#ffbd3d";

    ctx.fillRect(
        x + 10,
        y + player.height,
        8,
        12
    );

    ctx.fillRect(
        x + player.width - 18,
        y + player.height,
        8,
        12
    );

}


// ========================================
// BULLETS
// ========================================

let shootCooldown = 0;


function shoot() {

    if (shootCooldown > 0) {

        return;

    }


    bullets.push({

        x:
            player.x +
            player.width / 2 -
            3,

        y:
            player.y,

        width: 6,

        height: 18,

        speed: 9

    });


    shootCooldown = 10;

}


function updateBullets() {

    if (shootCooldown > 0) {

        shootCooldown--;

    }


    bullets.forEach(bullet => {

        bullet.y -= bullet.speed;

    });


    bullets =
        bullets.filter(
            bullet => bullet.y + bullet.height > 0
        );

}


function drawBullets() {

    bullets.forEach(bullet => {

        ctx.fillStyle = "#62d9ff";

        ctx.shadowBlur = 10;

        ctx.shadowColor = "#62d9ff";

        ctx.fillRect(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

        ctx.shadowBlur = 0;

    });

}


// ========================================
// ENEMIES
// ========================================

let enemyTimer = 0;


function createEnemy() {

    const size = 40;


    enemies.push({

        x:
            Math.random() *
            (WIDTH - size),

        y: -size,

        width: size,

        height: size,

        speed:
            Math.random() * 1.5 + 1,

        hp: 1

    });

}


function updateEnemies() {

    enemyTimer++;


    if (enemyTimer > 45) {

        createEnemy();

        enemyTimer = 0;

    }


    enemies.forEach(enemy => {

        enemy.y += enemy.speed;

    });


    // Kẻ địch đi quá màn hình

    enemies.forEach(enemy => {

        if (enemy.y > HEIGHT) {

            gameOver();

        }

    });

}


function drawEnemies() {

    enemies.forEach(enemy => {

        const centerX =
            enemy.x + enemy.width / 2;

        const centerY =
            enemy.y + enemy.height / 2;


        // Thân enemy

        ctx.fillStyle = "#62ff9a";

        ctx.beginPath();

        ctx.arc(
            centerX,
            centerY,
            enemy.width / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();


        // Mắt

        ctx.fillStyle = "#08100c";

        ctx.fillRect(
            enemy.x + 10,
            enemy.y + 12,
            6,
            6
        );

        ctx.fillRect(
            enemy.x + 24,
            enemy.y + 12,
            6,
            6
        );


        // Miệng

        ctx.fillRect(
            enemy.x + 13,
            enemy.y + 27,
            14,
            4
        );

    });

}


// ========================================
// COLLISION
// ========================================

function collision(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


function checkCollisions() {

    // Bullet -> Enemy

    bullets.forEach((bullet, bulletIndex) => {

        enemies.forEach((enemy, enemyIndex) => {

            if (
                collision(
                    bullet,
                    enemy
                )
            ) {

                createExplosion(
                    enemy.x +
                    enemy.width / 2,

                    enemy.y +
                    enemy.height / 2
                );


                bullets.splice(
                    bulletIndex,
                    1
                );


                enemies.splice(
                    enemyIndex,
                    1
                );


                score += 10;

                scoreElement.textContent =
                    score;

            }

        });

    });


    // Enemy -> Player

    enemies.forEach(enemy => {

        if (
            collision(
                player,
                enemy
            )
        ) {

            gameOver();

        }

    });

}


// ========================================
// PARTICLES
// ========================================

function createExplosion(x, y) {

    for (let i = 0; i < 15; i++) {

        particles.push({

            x: x,

            y: y,

            size:
                Math.random() * 4 + 1,

            speedX:
                (Math.random() - 0.5) * 5,

            speedY:
                (Math.random() - 0.5) * 5,

            life: 30

        });

    }

}


function updateParticles() {

    particles.forEach(particle => {

        particle.x += particle.speedX;

        particle.y += particle.speedY;

        particle.life--;

    });


    particles =
        particles.filter(
            particle => particle.life > 0
        );

}


function drawParticles() {

    particles.forEach(particle => {

        ctx.fillStyle = "#ffbd3d";

        ctx.globalAlpha =
            particle.life / 30;

        ctx.fillRect(
            particle.x,
            particle.y,
            particle.size,
            particle.size
        );

    });

    ctx.globalAlpha = 1;

}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

    if (!gameRunning) {

        return;

    }


    // Xóa màn hình

    ctx.clearRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Background

    ctx.fillStyle = "#02030a";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Game update

    updateStars();

    updatePlayer();

    updateBullets();

    updateEnemies();

    updateParticles();

    checkCollisions();


    // Game draw

    drawStars();

    drawPlayer();

    drawBullets();

    drawEnemies();

    drawParticles();


    animationId =
        requestAnimationFrame(gameLoop);

}


// ========================================
// START GAME
// ========================================

function startGame() {

    // Reset game

    score = 0;

    scoreElement.textContent =
        score;


    player.x =
        WIDTH / 2 -
        player.width / 2;

    player.y =
        HEIGHT - 80;


    bullets = [];

    enemies = [];

    particles = [];

    enemyTimer = 0;

    shootCooldown = 0;


    createStars();


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

    if (!gameRunning) {

        return;

    }


    gameRunning = false;


    cancelAnimationFrame(
        animationId
    );


    startScreen.style.display =
        "flex";


    startScreen.innerHTML = `

        <h2>GAME OVER</h2>

        <p>
            Điểm của bạn:
            <strong>${score}</strong>
        </p>

        <button
            class="start-button"
            onclick="startGame()"
        >
            CHƠI LẠI
        </button>

    `;

}


startButton.addEventListener(
    "click",
    startGame
);


// ========================================
// INITIALIZE
// ========================================

createStars();