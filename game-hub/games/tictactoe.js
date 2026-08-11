const cells =
    document.querySelectorAll(
        ".cell"
    );

const turnText =
    document.getElementById(
        "turnText"
    );

const result =
    document.getElementById(
        "result"
    );

const xScoreElement =
    document.getElementById(
        "xScore"
    );

const oScoreElement =
    document.getElementById(
        "oScore"
    );

const drawScoreElement =
    document.getElementById(
        "drawScore"
    );

const newGameButton =
    document.getElementById(
        "newGame"
    );

const resetScoreButton =
    document.getElementById(
        "resetScore"
    );


// ========================================
// GAME DATA
// ========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let currentPlayer = "X";

let gameActive = true;


let scores = {

    X: 0,

    O: 0,

    draw: 0

};


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


// ========================================
// CELL CLICK
// ========================================

cells.forEach(
    cell => {

        cell.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        cell.dataset.index
                    );


                if (
                    !gameActive
                ) {

                    return;

                }


                if (
                    board[index] !== ""
                ) {

                    return;

                }


                makeMove(
                    index
                );

            }
        );

    }
);


// ========================================
// MAKE MOVE
// ========================================

function makeMove(
    index
) {

    board[index] =
        currentPlayer;


    const cell =
        cells[index];


    cell.textContent =
        currentPlayer;


    cell.classList.add(
        currentPlayer.toLowerCase()
    );


    const winningLine =
        checkWinner();


    if (
        winningLine
    ) {

        endGame(
            currentPlayer,
            winningLine
        );

        return;

    }


    if (
        checkDraw()
    ) {

        endDraw();

        return;

    }


    switchPlayer();

}


// ========================================
// SWITCH PLAYER
// ========================================

function switchPlayer() {

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    turnText.textContent =
        currentPlayer;


    turnText.style.color =
        currentPlayer === "X"
            ? "#38bdf8"
            : "#f472b6";

}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner() {

    for (
        const combination
        of winningCombinations
    ) {

        const a =
            combination[0];

        const b =
            combination[1];

        const c =
            combination[2];


        if (
            board[a] !== "" &&

            board[a] ===
            board[b] &&

            board[a] ===
            board[c]
        ) {

            return combination;

        }

    }


    return null;

}


// ========================================
// CHECK DRAW
// ========================================

function checkDraw() {

    return board.every(
        cell =>
            cell !== ""
    );

}


// ========================================
// END GAME
// ========================================

function endGame(
    winner,
    winningLine
) {

    gameActive = false;


    scores[winner]++;


    updateScore();


    winningLine.forEach(
        index => {

            cells[index]
                .classList
                .add(
                    "winner"
                );

        }
    );


    result.innerHTML =
        `🎉 Người chơi
        <strong>${winner}</strong>
        thắng!`;


    turnText.textContent =
        `${winner} THẮNG`;


    turnText.style.color =
        winner === "X"
            ? "#38bdf8"
            : "#f472b6";

}


// ========================================
// END DRAW
// ========================================

function endDraw() {

    gameActive = false;


    scores.draw++;


    updateScore();


    result.textContent =
        "🤝 Ván đấu hòa!";


    turnText.textContent =
        "HÒA";


    turnText.style.color =
        "#a855f7";

}


// ========================================
// UPDATE SCORE
// ========================================

function updateScore() {

    xScoreElement.textContent =
        scores.X;


    oScoreElement.textContent =
        scores.O;


    drawScoreElement.textContent =
        scores.draw;

}


// ========================================
// NEW GAME
// ========================================

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(
        cell => {

            cell.textContent =
                "";

            cell.classList.remove(
                "x",
                "o",
                "winner"
            );

        }
    );


    turnText.textContent =
        "X";


    turnText.style.color =
        "#38bdf8";


    result.textContent =
        "";

}


// ========================================
// RESET SCORE
// ========================================

function resetScore() {

    scores = {

        X: 0,

        O: 0,

        draw: 0

    };


    updateScore();


    newGame();

}


// ========================================
// BUTTON EVENTS
// ========================================

newGameButton.addEventListener(
    "click",
    newGame
);


resetScoreButton.addEventListener(
    "click",
    resetScore
);


// ========================================
// INITIALIZE
// ========================================

updateScore();