const gameCards = document.querySelectorAll(".game-card");
const gameCount = document.getElementById("gameCount");
const noResult = document.getElementById("noResult");
const searchInput = document.getElementById("searchInput");


// =============================
// LỌC GAME THEO THỂ LOẠI
// =============================

function filterGames(category, button) {

    // Xóa trạng thái active của các nút
    document.querySelectorAll(".category").forEach(btn => {
        btn.classList.remove("active");
    });

    // Thêm active cho nút đang chọn
    button.classList.add("active");


    let visibleGames = 0;


    gameCards.forEach(card => {

        const cardCategory =
            card.getAttribute("data-category");


        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.style.display = "block";

            visibleGames++;

        } else {

            card.style.display = "none";

        }

    });


    updateGameCount(visibleGames);

    noResult.style.display =
        visibleGames === 0 ? "block" : "none";
}



// =============================
// TÌM KIẾM GAME
// =============================

function searchGames() {

    const keyword =
        searchInput.value
            .toLowerCase()
            .trim();


    let visibleGames = 0;


    gameCards.forEach(card => {

        const gameName =
            card.getAttribute("data-name")
                .toLowerCase();


        const category =
            card.getAttribute("data-category")
                .toLowerCase();


        if (
            gameName.includes(keyword) ||
            category.includes(keyword)
        ) {

            card.style.display = "block";

            visibleGames++;

        } else {

            card.style.display = "none";

        }

    });


    updateGameCount(visibleGames);

    noResult.style.display =
        visibleGames === 0 ? "block" : "none";
}



// =============================
// TÌM KIẾM KHI NHẤN ENTER
// =============================

searchInput.addEventListener(
    "keyup",
    function(event) {

        if (event.key === "Enter") {

            searchGames();

        }

    }
);



// =============================
// CẬP NHẬT SỐ GAME
// =============================

function updateGameCount(count) {

    gameCount.textContent =
        count + " GAME";

}