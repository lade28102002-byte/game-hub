const memoryBoard =
    document.getElementById(
        "memoryBoard"
    );

const movesElement =
    document.getElementById(
        "moves"
    );

const pairsElement =
    document.getElementById(
        "pairs"
    );

const result =
    document.getElementById(
        "result"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );


// ========================================
// CARD DATA
// ========================================

const symbols = [

    "🍎",
    "🍉",
    "🍊",
    "🍓",
    "🍌",
    "🍇",
    "🥝",
    "🍍"

];


let cards = [];

let flippedCards = [];

let matchedPairs = 0;

let moves = 0;

let lockBoard = false;


// ========================================
// CREATE DECK
// ========================================

function createDeck() {

    cards = [

        ...symbols,
        ...symbols

    ];


    shuffleCards();

}


// ========================================
// SHUFFLE
// ========================================

function shuffleCards() {

    for (
        let i =
            cards.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            cards[i],
            cards[randomIndex]
        ] =
        [
            cards[randomIndex],
            cards[i]
        ];

    }

}


// ========================================
// CREATE BOARD
// ========================================

function createBoard() {

    memoryBoard.innerHTML =
        "";


    cards.forEach(
        (symbol, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.className =
                "card";


            card.dataset.index =
                index;


            card.innerHTML = `

                <div class="card-inner">

                    <div class="card-front">
                        ?
                    </div>

                    <div class="card-back">
                        ${symbol}
                    </div>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    flipCard(
                        card
                    );

                }
            );


            memoryBoard.appendChild(
                card
            );

        }
    );

}


// ========================================
// FLIP CARD
// ========================================

function flipCard(
    card
) {

    if (
        lockBoard
    ) {

        return;

    }


    if (
        card.classList.contains(
            "flipped"
        )
    ) {

        return;

    }


    if (
        card.classList.contains(
            "matched"
        )
    ) {

        return;

    }


    if (
        flippedCards.length >= 2
    ) {

        return;

    }


    card.classList.add(
        "flipped"
    );


    flippedCards.push(
        card
    );


    if (
        flippedCards.length === 2
    ) {

        moves++;


        movesElement.textContent =
            moves;


        checkMatch();

    }

}


// ========================================
// CHECK MATCH
// ========================================

function checkMatch() {

    lockBoard = true;


    const firstCard =
        flippedCards[0];

    const secondCard =
        flippedCards[1];


    const firstIndex =
        Number(
            firstCard.dataset.index
        );

    const secondIndex =
        Number(
            secondCard.dataset.index
        );


    const isMatch =
        cards[firstIndex] ===
        cards[secondIndex];


    if (
        isMatch
    ) {

        matchCards();

    }

    else {

        setTimeout(
            unflipCards,
            850
        );

    }

}


// ========================================
// MATCH CARDS
// ========================================

function matchCards() {

    flippedCards.forEach(
        card => {

            card.classList.add(
                "matched"
            );

        }
    );


    matchedPairs++;


    pairsElement.textContent =
        `${matchedPairs}/8`;


    flippedCards = [];


    lockBoard = false;


    if (
        matchedPairs ===
        symbols.length
    ) {

        gameComplete();

    }

}


// ========================================
// UNFLIP CARDS
// ========================================

function unflipCards() {

    flippedCards.forEach(
        card => {

            card.classList.remove(
                "flipped"
            );

        }
    );


    flippedCards = [];


    lockBoard = false;

}


// ========================================
// GAME COMPLETE
// ========================================

function gameComplete() {

    result.innerHTML = `

        🎉 Hoàn thành!

        Bạn đã tìm được
        <strong>
            8/8 cặp
        </strong>

        trong
        <strong>
            ${moves}
        </strong>
        lượt.

    `;

}


// ========================================
// START / RESTART
// ========================================

function startGame() {

    cards = [];

    flippedCards = [];

    matchedPairs = 0;

    moves = 0;

    lockBoard = false;


    movesElement.textContent =
        "0";


    pairsElement.textContent =
        "0/8";


    result.textContent =
        "";


    createDeck();

    createBoard();

}


restartButton.addEventListener(
    "click",
    startGame
);


// ========================================
// INITIALIZE
// ========================================

startGame();