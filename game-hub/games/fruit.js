const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");
const livesElement = document.getElementById("lives");
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let fruits = [];
let particles = [];
let slashTrail = [];

let score = 0;
let lives = 3;

let gameRunning = false;
let animationId = null;

let spawnTimer = 0;

let mouseX = 0;
let mouseY = 0;

let isMouseDown = false;


// ========================================
// LOẠI TRÁI CÂY
// ========================================

const fruitTypes = [
    {
        type: "apple",
        color: "#ef4444",
        darkColor: "#991b1b",
        points: 10
    },

    {
        type: "orange",
        color: "#f97316",
        darkColor: "#c2410c",
        points: 10
    },

    {
        type: "watermelon",
        color: "#22c55e",
        darkColor: "#15803d",
        points: 15
    },

    {
        type: "strawberry",
        color: "#f43f5e",
        darkColor: "#be123c",
        points: 20
    },

    {
        type: "lemon",
        color: "#facc15",
        darkColor: "#ca8a04",
        points: 15
    }
];


// ========================================
// BẮT ĐẦU GAME
// ========================================

function startGame() {

    fruits = [];
    particles = [];
    slashTrail = [];

    score = 0;
    lives = 3;
    spawnTimer = 0;

    scoreElement.textContent = "0";

    updateLives();

    gameRunning = true;

    startScreen.style.display = "none";

    cancelAnimationFrame(animationId);

    gameLoop();
}


// ========================================
// HIỂN THỊ MẠNG
// ========================================

function updateLives() {

    livesElement.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);
}


// ========================================
// TẠO TRÁI CÂY
// ========================================

function createFruit() {

    const type =
        fruitTypes[
            Math.floor(
                Math.random() * fruitTypes.length
            )
        ];

    const fruit = {

        x:
            70 +
            Math.random() *
            (WIDTH - 140),

        y:
            HEIGHT + 40,

        radius:
            30,

        velocityX:
            (Math.random() - 0.5) * 5,

        velocityY:
            -14 -
            Math.random() * 4,

        gravity:
            0.35,

        rotation:
            Math.random() *
            Math.PI *
            2,

        rotationSpeed:
            (Math.random() - 0.5) * 0.08,

        type:
            type,

        sliced:
            false,

        dead:
            false,

        bomb:
            false

    };

    fruits.push(fruit);
}


// ========================================
// TẠO BOM
// ========================================

function createBomb() {

    fruits.push({

        x:
            70 +
            Math.random() *
            (WIDTH - 140),

        y:
            HEIGHT + 40,

        radius:
            30,

        velocityX:
            (Math.random() - 0.5) * 5,

        velocityY:
            -15,

        gravity:
            0.35,

        rotation:
            0,

        rotationSpeed:
            0.05,

        bomb:
            true,

        sliced:
            false,

        dead:
            false

    });
}


// ========================================
// SPAWN TRÁI CÂY
// ========================================

function spawnObjects() {

    spawnTimer++;

    const spawnRate =
        Math.max(
            28,
            60 - score * 0.25
        );

    if (spawnTimer >= spawnRate) {

        spawnTimer = 0;

        // Luôn tạo ít nhất 1 trái cây
        createFruit();

        // Có cơ hội tạo thêm trái cây
        if (Math.random() < 0.35) {
            createFruit();
        }

        // Bom xuất hiện ít hơn trái cây
        if (
            score > 5 &&
            Math.random() < 0.12
        ) {
            createBomb();
        }
    }
}


// ========================================
// CẬP NHẬT TRÁI CÂY
// ========================================

function updateFruits() {

    for (const fruit of fruits) {

        fruit.x += fruit.velocityX;

        fruit.y += fruit.velocityY;

        fruit.velocityY += fruit.gravity;

        fruit.rotation += fruit.rotationSpeed;


        // Nếu rơi khỏi màn hình

        if (
            fruit.y - fruit.radius >
            HEIGHT
        ) {

            if (
                !fruit.sliced &&
                !fruit.bomb
            ) {

                lives--;

                updateLives();

                if (lives <= 0) {

                    gameOver();

                    return;
                }
            }

            fruit.dead = true;
        }
    }


    fruits = fruits.filter(
        fruit => !fruit.dead
    );
}


// ========================================
// VẼ TRÁI CÂY
// ========================================

function drawFruits() {

    for (const fruit of fruits) {

        ctx.save();

        ctx.translate(
            fruit.x,
            fruit.y
        );

        ctx.rotate(
            fruit.rotation
        );


        if (fruit.bomb) {

            drawBomb();

        } else {

            drawFruit(fruit);

        }


        ctx.restore();
    }
}


// ========================================
// VẼ TRÁI CÂY
// ========================================

function drawFruit(fruit) {

    const type =
        fruit.type.type;


    if (type === "apple") {

        drawApple(fruit);

    }

    else if (type === "orange") {

        drawOrange(fruit);

    }

    else if (type === "watermelon") {

        drawWatermelon(fruit);

    }

    else if (type === "strawberry") {

        drawStrawberry(fruit);

    }

    else if (type === "lemon") {

        drawLemon(fruit);

    }
}


// ========================================
// TÁO
// ========================================

function drawApple(fruit) {

    ctx.fillStyle =
        fruit.type.color;

    ctx.beginPath();

    ctx.arc(
        -11,
        2,
        18,
        0,
        Math.PI * 2
    );

    ctx.arc(
        11,
        2,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Phần dưới

    ctx.beginPath();

    ctx.arc(
        0,
        10,
        22,
        0,
        Math.PI
    );

    ctx.fill();


    // Cuống

    ctx.strokeStyle =
        "#713f12";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(0, -15);

    ctx.lineTo(3, -28);

    ctx.stroke();


    // Lá

    ctx.fillStyle =
        "#22c55e";

    ctx.beginPath();

    ctx.ellipse(
        10,
        -22,
        10,
        5,
        -0.5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Highlight

    ctx.fillStyle =
        "rgba(255,255,255,0.35)";

    ctx.beginPath();

    ctx.arc(
        -10,
        -5,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ========================================
// CAM
// ========================================

function drawOrange(fruit) {

    ctx.fillStyle =
        fruit.type.color;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        27,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        fruit.type.darkColor;

    ctx.lineWidth = 3;

    ctx.stroke();


    // Vân trên quả

    ctx.strokeStyle =
        "rgba(255,255,255,0.25)";

    ctx.lineWidth = 2;

    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            8 + i * 4,
            0,
            Math.PI * 2
        );

        ctx.stroke();
    }


    // Cuống

    ctx.fillStyle =
        "#22c55e";

    ctx.beginPath();

    ctx.arc(
        5,
        -24,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ========================================
// DƯA HẤU
// ========================================

function drawWatermelon(fruit) {

    ctx.fillStyle =
        fruit.type.color;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        29,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#15803d";

    ctx.lineWidth = 5;

    ctx.stroke();


    // Sọc

    ctx.strokeStyle =
        "#86efac";

    ctx.lineWidth = 3;

    for (
        let x = -18;
        x <= 18;
        x += 12
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            -20
        );

        ctx.lineTo(
            x,
            20
        );

        ctx.stroke();
    }


    // Hạt

    ctx.fillStyle =
        "#111827";

    const seeds = [
        [-10, -5],
        [2, -12],
        [12, 0],
        [-4, 10],
        [8, 12]
    ];

    for (const seed of seeds) {

        ctx.beginPath();

        ctx.ellipse(
            seed[0],
            seed[1],
            2,
            4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ========================================
// DÂU
// ========================================

function drawStrawberry(fruit) {

    ctx.fillStyle =
        fruit.type.color;

    ctx.beginPath();

    ctx.moveTo(
        0,
        30
    );

    ctx.bezierCurveTo(
        -30,
        10,
        -28,
        -20,
        0,
        -10
    );

    ctx.bezierCurveTo(
        28,
        -20,
        30,
        10,
        0,
        30
    );

    ctx.fill();


    // Lá

    ctx.fillStyle =
        "#22c55e";

    ctx.beginPath();

    ctx.moveTo(
        -15,
        -13
    );

    ctx.lineTo(
        0,
        -27
    );

    ctx.lineTo(
        15,
        -13
    );

    ctx.lineTo(
        7,
        -17
    );

    ctx.lineTo(
        0,
        -8
    );

    ctx.lineTo(
        -7,
        -17
    );

    ctx.closePath();

    ctx.fill();


    // Hạt

    ctx.fillStyle =
        "#fef3c7";

    const seeds = [
        [-12, -3],
        [0, -5],
        [12, -3],
        [-8, 9],
        [5, 10],
        [0, 20]
    ];

    for (const seed of seeds) {

        ctx.beginPath();

        ctx.ellipse(
            seed[0],
            seed[1],
            2,
            4,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ========================================
// CHANH
// ========================================

function drawLemon(fruit) {

    ctx.fillStyle =
        fruit.type.color;

    ctx.beginPath();

    ctx.ellipse(
        0,
        0,
        24,
        31,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        fruit.type.darkColor;

    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.moveTo(
        -8,
        -20
    );

    ctx.lineTo(
        8,
        20
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        8,
        -20
    );

    ctx.lineTo(
        -8,
        20
    );

    ctx.stroke();
}


// ========================================
// BOM
// ========================================

function drawBomb() {

    // Thân bom

    ctx.fillStyle =
        "#111827";

    ctx.beginPath();

    ctx.arc(
        0,
        5,
        25,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#4b5563";

    ctx.lineWidth = 4;

    ctx.stroke();


    // Ngòi

    ctx.strokeStyle =
        "#92400e";

    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(
        12,
        -17
    );

    ctx.quadraticCurveTo(
        22,
        -30,
        30,
        -20
    );

    ctx.stroke();


    // Lửa

    ctx.fillStyle =
        "#f97316";

    ctx.beginPath();

    ctx.arc(
        31,
        -20,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Highlight

    ctx.fillStyle =
        "#6b7280";

    ctx.beginPath();

    ctx.arc(
        -8,
        -3,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();
}


// ========================================
// CHÉM
// ========================================

function checkSlice(x, y) {

    for (const fruit of fruits) {

        if (
            fruit.sliced ||
            fruit.dead
        ) {
            continue;
        }


        const dx =
            x - fruit.x;

        const dy =
            y - fruit.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (
            distance <
            fruit.radius + 15
        ) {

            sliceFruit(fruit);
        }
    }
}


// ========================================
// CHÉM TRÁI CÂY
// ========================================

function sliceFruit(fruit) {

    fruit.sliced = true;

    fruit.dead = true;


    // Nếu chém bom

    if (fruit.bomb) {

        createExplosion(
            fruit.x,
            fruit.y
        );

        lives = 0;

        updateLives();

        gameOver();

        return;
    }


    score +=
        fruit.type.points;


    scoreElement.textContent =
        score;


    createFruitParticles(
        fruit
    );
}


// ========================================
// HIỆU ỨNG TRÁI CÂY
// ========================================

function createFruitParticles(fruit) {

    for (
        let i = 0;
        i < 15;
        i++
    ) {

        particles.push({

            x: fruit.x,

            y: fruit.y,

            velocityX:
                (Math.random() - 0.5) * 9,

            velocityY:
                (Math.random() - 0.5) * 9,

            size:
                3 + Math.random() * 5,

            color:
                fruit.type.color,

            life:
                35

        });
    }
}


// ========================================
// HIỆU ỨNG BOM
// ========================================

function createExplosion(x, y) {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        particles.push({

            x: x,

            y: y,

            velocityX:
                (Math.random() - 0.5) * 15,

            velocityY:
                (Math.random() - 0.5) * 15,

            size:
                3 + Math.random() * 7,

            color:
                Math.random() < 0.5
                    ? "#ef4444"
                    : "#facc15",

            life:
                45

        });
    }
}


// ========================================
// PARTICLES
// ========================================

function updateParticles() {

    for (const particle of particles) {

        particle.x +=
            particle.velocityX;

        particle.y +=
            particle.velocityY;

        particle.velocityY +=
            0.2;

        particle.life--;
    }


    particles =
        particles.filter(
            particle =>
                particle.life > 0
        );
}


function drawParticles() {

    for (const particle of particles) {

        ctx.globalAlpha =
            particle.life / 45;

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

    ctx.globalAlpha = 1;
}


// ========================================
// SLASH TRAIL
// ========================================

function addSlashPoint(x, y) {

    slashTrail.push({

        x: x,

        y: y,

        life: 12

    });


    checkSlice(x, y);
}


function updateSlashTrail() {

    for (const point of slashTrail) {

        point.life--;
    }


    slashTrail =
        slashTrail.filter(
            point =>
                point.life > 0
        );
}


function drawSlashTrail() {

    if (
        slashTrail.length < 2
    ) {
        return;
    }


    ctx.save();

    ctx.lineCap =
        "round";

    ctx.lineJoin =
        "round";


    for (
        let i = 1;
        i < slashTrail.length;
        i++
    ) {

        const previous =
            slashTrail[i - 1];

        const current =
            slashTrail[i];


        ctx.globalAlpha =
            current.life / 12;

        ctx.strokeStyle =
            "#ffffff";

        ctx.lineWidth = 6;

        ctx.beginPath();

        ctx.moveTo(
            previous.x,
            previous.y
        );

        ctx.lineTo(
            current.x,
            current.y
        );

        ctx.stroke();
    }


    ctx.restore();

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
        "#111827"
    );

    gradient.addColorStop(
        1,
        "#1f2937"
    );


    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        WIDTH,
        HEIGHT
    );


    // Vòng tròn trang trí

    ctx.fillStyle =
        "rgba(249,115,22,0.06)";


    ctx.beginPath();

    ctx.arc(
        100,
        120,
        100,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        800,
        430,
        150,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Mặt đất

    ctx.fillStyle =
        "#151a22";

    ctx.fillRect(
        0,
        HEIGHT - 35,
        WIDTH,
        35
    );


    ctx.fillStyle =
        "#f97316";

    ctx.fillRect(
        0,
        HEIGHT - 35,
        WIDTH,
        3
    );
}


// ========================================
// INPUT - CHUỘT
// ========================================

canvas.addEventListener(
    "mousedown",
    function(event) {

        isMouseDown = true;

        updateMousePosition(event);

        addSlashPoint(
            mouseX,
            mouseY
        );
    }
);


canvas.addEventListener(
    "mousemove",
    function(event) {

        updateMousePosition(event);

        if (
            isMouseDown &&
            gameRunning
        ) {

            addSlashPoint(
                mouseX,
                mouseY
            );
        }
    }
);


canvas.addEventListener(
    "mouseup",
    function() {

        isMouseDown = false;
    }
);


canvas.addEventListener(
    "mouseleave",
    function() {

        isMouseDown = false;
    }
);


// ========================================
// TOUCH
// ========================================

canvas.addEventListener(
    "touchstart",
    function(event) {

        event.preventDefault();

        updateTouchPosition(
            event.touches[0]
        );

        addSlashPoint(
            mouseX,
            mouseY
        );
    },
    {
        passive: false
    }
);


canvas.addEventListener(
    "touchmove",
    function(event) {

        event.preventDefault();

        updateTouchPosition(
            event.touches[0]
        );

        addSlashPoint(
            mouseX,
            mouseY
        );
    },
    {
        passive: false
    }
);


function updateMousePosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    mouseX =
        (
            event.clientX -
            rect.left
        ) *
        WIDTH /
        rect.width;


    mouseY =
        (
            event.clientY -
            rect.top
        ) *
        HEIGHT /
        rect.height;
}


function updateTouchPosition(touch) {

    const rect =
        canvas.getBoundingClientRect();


    mouseX =
        (
            touch.clientX -
            rect.left
        ) *
        WIDTH /
        rect.width;


    mouseY =
        (
            touch.clientY -
            rect.top
        ) *
        HEIGHT /
        rect.height;
}


// ========================================
// GAME LOOP
// ========================================

function gameLoop() {

    if (!gameRunning) {
        return;
    }


    // Vẽ background trước

    drawBackground();


    // Tạo trái cây

    spawnObjects();


    // Cập nhật

    updateFruits();

    updateParticles();

    updateSlashTrail();


    // Vẽ

    drawFruits();

    drawParticles();

    drawSlashTrail();


    animationId =
        requestAnimationFrame(
            gameLoop
        );
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


    startScreen.style.display =
        "flex";
}


// ========================================
// NÚT BẮT ĐẦU
// ========================================

startButton.addEventListener(
    "click",
    startGame
);