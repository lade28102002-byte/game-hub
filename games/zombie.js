const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement =
    document.getElementById("score");

const healthElement =
    document.getElementById("health");

const startScreen =
    document.getElementById("startScreen");

const startButton =
    document.getElementById("startButton");


const WIDTH = canvas.width;
const HEIGHT = canvas.height;


let gameRunning = false;
let animationId;

let score = 0;
let health = 100;

let zombieTimer = 0;
let difficultyTimer = 0;

let mouseX = WIDTH / 2;
let mouseY = HEIGHT / 2;

let mouseDown = false;


const keys = {};

let bullets = [];
let zombies = [];
let particles = [];


// ========================================
// PLAYER
// ========================================

const player = {

    x: WIDTH / 2,

    y: HEIGHT / 2,

    radius: 20,

    speed: 4,

    angle: 0

};


// ========================================
// KEYBOARD
// ========================================

document.addEventListener(
    "keydown",
    event => {

        keys[event.code] = true;

        if (
            event.code === "Space"
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


// ========================================
// MOUSE
// ========================================

canvas.addEventListener(
    "mousemove",
    event => {

        const rect =
            canvas.getBoundingClientRect();

        const scaleX =
            WIDTH / rect.width;

        const scaleY =
            HEIGHT / rect.height;


        mouseX =
            (event.clientX - rect.left)
            * scaleX;

        mouseY =
            (event.clientY - rect.top)
            * scaleY;

    }
);


canvas.addEventListener(
    "mousedown",
    event => {

        if (
            event.button === 0 &&
            gameRunning
        ) {

            mouseDown = true;

            shoot();

        }

    }
);


canvas.addEventListener(
    "mouseup",
    event => {

        if (event.button === 0) {

            mouseDown = false;

        }

    }
);


canvas.addEventListener(
    "mouseleave",
    () => {

        mouseDown = false;

    }
);


// ========================================
// PLAYER
// ========================================

function updatePlayer() {

    let dx = 0;
    let dy = 0;


    if (
        keys["KeyW"] ||
        keys["ArrowUp"]
    ) {

        dy--;

    }

    if (
        keys["KeyS"] ||
        keys["ArrowDown"]
    ) {

        dy++;

    }

    if (
        keys["KeyA"] ||
        keys["ArrowLeft"]
    ) {

        dx--;

    }

    if (
        keys["KeyD"] ||
        keys["ArrowRight"]
    ) {

        dx++;

    }


    if (dx !== 0 || dy !== 0) {

        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        dx /= length;
        dy /= length;


        player.x +=
            dx * player.speed;

        player.y +=
            dy * player.speed;

    }


    // Giới hạn màn hình

    if (
        player.x <
        player.radius
    ) {

        player.x =
            player.radius;

    }


    if (
        player.x >
        WIDTH -
        player.radius
    ) {

        player.x =
            WIDTH -
            player.radius;

    }


    if (
        player.y <
        player.radius
    ) {

        player.y =
            player.radius;

    }


    if (
        player.y >
        HEIGHT -
        player.radius
    ) {

        player.y =
            HEIGHT -
            player.radius;

    }


    // Góc nhìn

    player.angle =
        Math.atan2(
            mouseY - player.y,
            mouseX - player.x
        );

}


// ========================================
// DRAW PLAYER
// ========================================

function drawPlayer() {

    ctx.save();

    ctx.translate(
        player.x,
        player.y
    );

    ctx.rotate(
        player.angle
    );


    // Body

    ctx.fillStyle =
        "#67e36f";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        player.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Gun

    ctx.fillStyle =
        "#d6ddd7";

    ctx.fillRect(
        5,
        -5,
        30,
        10
    );


    // Face

    ctx.fillStyle =
        "#142018";

    ctx.beginPath();

    ctx.arc(
        5,
        -6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
        5,
        6,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}


// ========================================
// SHOOT
// ========================================

let shootCooldown = 0;


function shoot() {

    if (
        shootCooldown > 0
    ) {

        return;

    }


    const angle =
        player.angle;


    const speed = 10;


    bullets.push({

        x:
            player.x +
            Math.cos(angle) * 30,

        y:
            player.y +
            Math.sin(angle) * 30,

        radius: 5,

        speedX:
            Math.cos(angle) * speed,

        speedY:
            Math.sin(angle) * speed

    });


    shootCooldown = 10;

}


function updateBullets() {

    if (
        shootCooldown > 0
    ) {

        shootCooldown--;

    }


    if (mouseDown) {

        shoot();

    }


    bullets.forEach(
        bullet => {

            bullet.x +=
                bullet.speedX;

            bullet.y +=
                bullet.speedY;

        }
    );


    bullets =
        bullets.filter(
            bullet => {

                return (
                    bullet.x > -20 &&
                    bullet.x < WIDTH + 20 &&
                    bullet.y > -20 &&
                    bullet.y < HEIGHT + 20
                );

            }
        );

}


function drawBullets() {

    bullets.forEach(
        bullet => {

            ctx.fillStyle =
                "#ffd45a";

            ctx.beginPath();

            ctx.arc(
                bullet.x,
                bullet.y,
                bullet.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }
    );

}


// ========================================
// ZOMBIES
// ========================================

function createZombie() {

    const side =
        Math.floor(
            Math.random() * 4
        );


    let x;
    let y;


    if (side === 0) {

        x =
            Math.random() * WIDTH;

        y = -40;

    }

    else if (side === 1) {

        x =
            WIDTH + 40;

        y =
            Math.random() * HEIGHT;

    }

    else if (side === 2) {

        x =
            Math.random() * WIDTH;

        y =
            HEIGHT + 40;

    }

    else {

        x = -40;

        y =
            Math.random() * HEIGHT;

    }


    const size =
        Math.random() * 8 + 20;


    zombies.push({

        x: x,

        y: y,

        radius: size,

        speed:
            Math.random() * 0.6 +
            0.7,

        health: 1

    });

}


function updateZombies() {

    zombieTimer++;


    const spawnRate =
        Math.max(
            18,
            55 -
            Math.floor(
                score / 100
            )
        );


    if (
        zombieTimer >=
        spawnRate
    ) {

        createZombie();

        zombieTimer = 0;

    }


    zombies.forEach(
        zombie => {

            const dx =
                player.x -
                zombie.x;

            const dy =
                player.y -
                zombie.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (distance > 0) {

                zombie.x +=
                    dx / distance *
                    zombie.speed;

                zombie.y +=
                    dy / distance *
                    zombie.speed;

            }


            // Zombie chạm player

            if (
                distance <
                player.radius +
                zombie.radius
            ) {

                health -= 0.35;

                healthElement.textContent =
                    Math.max(
                        0,
                        Math.floor(health)
                    );

            }

        }
    );


    zombies =
        zombies.filter(
            zombie => {

                if (
                    zombie.health <= 0
                ) {

                    return false;

                }

                return true;

            }
        );

}


function drawZombies() {

    zombies.forEach(
        zombie => {

            const x =
                zombie.x;

            const y =
                zombie.y;


            // Body

            ctx.fillStyle =
                "#62b866";

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                zombie.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Dark shirt

            ctx.fillStyle =
                "#253d29";

            ctx.fillRect(
                x - zombie.radius * 0.65,
                y + zombie.radius * 0.35,
                zombie.radius * 1.3,
                zombie.radius * 0.8
            );


            // Eyes

            ctx.fillStyle =
                "#ff4545";

            ctx.beginPath();

            ctx.arc(
                x - 6,
                y - 4,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            ctx.beginPath();

            ctx.arc(
                x + 6,
                y - 4,
                3,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Mouth

            ctx.fillStyle =
                "#172219";

            ctx.fillRect(
                x - 7,
                y + 7,
                14,
                4
            );

        }
    );

}


// ========================================
// COLLISION
// ========================================

function distanceBetween(
    x1,
    y1,
    x2,
    y2
) {

    const dx =
        x1 - x2;

    const dy =
        y1 - y2;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


function checkBulletCollisions() {

    bullets.forEach(
        (bullet, bulletIndex) => {

            zombies.forEach(
                (zombie, zombieIndex) => {

                    const distance =
                        distanceBetween(
                            bullet.x,
                            bullet.y,
                            zombie.x,
                            zombie.y
                        );


                    if (
                        distance <
                        bullet.radius +
                        zombie.radius
                    ) {

                        zombie.health--;

                        bullets.splice(
                            bulletIndex,
                            1
                        );


                        if (
                            zombie.health <= 0
                        ) {

                            createExplosion(
                                zombie.x,
                                zombie.y
                            );


                            zombies.splice(
                                zombieIndex,
                                1
                            );


                            score += 10;

                            scoreElement.textContent =
                                score;

                        }

                    }

                }
            );

        }
    );

}


// ========================================
// PARTICLES
// ========================================

function createExplosion(
    x,
    y
) {

    for (
        let i = 0;
        i < 12;
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

            life: 25

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
                "#67e36f";

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

    ctx.fillStyle =
        "#08100b";

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Grid

    ctx.strokeStyle =
        "rgba(103,227,111,0.06)";

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


    drawBackground();


    updatePlayer();

    updateBullets();

    updateZombies();

    updateParticles();


    checkBulletCollisions();


    drawBullets();

    drawZombies();

    drawPlayer();

    drawParticles();


    difficultyTimer++;


    if (
        health <= 0
    ) {

        gameOver();

        return;

    }


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

    health = 100;

    zombieTimer = 0;

    difficultyTimer = 0;

    bullets = [];

    zombies = [];

    particles = [];


    scoreElement.textContent =
        "0";

    healthElement.textContent =
        "100";


    player.x =
        WIDTH / 2;

    player.y =
        HEIGHT / 2;


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
            Bạn đã bị zombie hạ gục.<br>
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