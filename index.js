let homeScore = 0;
let guestScore = 0;
let quarter = 0;
const timerEl = document.querySelector("#timer");
const homeScoreboard = document.querySelector("#home");
const guestScoreboard = document.querySelector("#guest");
const scoreboardsWrapper = document.querySelector(".scoreboard-main-wrapper");
const startBtn = document.querySelector("#start-btn");

function getCurrentScoreboard(e) {
    return e.target.closest("div").parentElement;
}

function getCurrentPointsText(e) {
    const currentScoreboard = getCurrentScoreboard(e);
    return currentScoreboard.querySelector(".scoreboard-points");
}

function getCurrentPoint(e) {
    return Number(e.target.dataset.point);
}

function addPoints(e, points) {
    const currentScoreboard = e.target.closest("div").parentElement;

    if (currentScoreboard.id === "home") {
        homeScore += points;
        console.log(homeScore);
    }

    if (currentScoreboard.id === "guest") {
        guestScore += points;
        console.log(guestScore);
    }
}

function updateScore(e) {
    const scoreBoard = getCurrentScoreboard(e);
    const scoreEl = scoreBoard.querySelector(".scoreboard-current-score");
    let score;

    if (scoreBoard.id === "home") {
        score = homeScore;
    }

    if (scoreBoard.id === "guest") {
        score = guestScore;
    }

    scoreEl.innerText = score;
}

function startTimer() {
    timerEl.classList.remove("red");
    let timer = 15;

    if (quarter === 5) return;
    timerEl.textContent = "00:" + timer;
    const interval = setInterval(() => {
        timer--;
        timerEl.textContent = "00:" + timer;
        if (String(timer).length !== 2) {
            timerEl.textContent = "00:0" + timer;
        }

        if (timer === 0) {
            clearInterval(interval);
            timerEl.classList.add("red");

            // update quarters
            updateQuarter();
            // show winner
            showQuarterWinner();
            // clear scores el
            clearScoresEl();

            if (quarter !== 5) {
                startTimer();
            } else {
                gameOver();
                timerEl.classList.remove("red");
            }
        }

        console.log("timer", timer);
    }, 1000);
}

function gameOver() {
    if (homeScore > guestScore) {
        homeScoreboard.classList.add("winner");
        homeScoreboard.querySelector(".scoreboard-title").textContent =
            "Winner";
    } else {
        guestScoreboard.classList.add("winner");
        guestScoreboard.querySelector(".scoreboard-title").textContent =
            "Winner";
    }

    startBtn.textContent = "Play Again";
    startBtn.id = "play-again";
    startBtn.disabled = "false";

    disablePointerButtons();
}

function gameReset() {
    clearScoresEl();
    homeScore = 0;
    guestScore = 0;
    quarter = 0;
    homeScoreboard.querySelector(".scoreboard-title").textContent = "Winner";
    guestScoreboard.querySelector(".scoreboard-title").textContent = "Winner";
    removeDisablePointerButtons();
    startBtn.textContent = "Start Game";
    startTimer();
    updateQuarter();
}

function updateQuarter() {
    quarter++;

    if (quarter === 5) {
        return;
    } else {
        const quarterEl = document.querySelector("#scoreboard-quarters-played");
        quarterEl.textContent = quarter;
    }
}

function disablePointerButtons() {
    const btns = document.querySelectorAll(".scoreboard-points-btn");
    btns.forEach((b) => (b.disabled = true));
}

function removeDisablePointerButtons() {
    const btns = document.querySelectorAll(".scoreboard-points-btn");
    btns.forEach((b) => (b.disabled = false));
}

function showQuarterWinner() {
    if (homeScore > guestScore) {
        homeScoreboard.classList.add("winner");
    }

    if (guestScore > homeScore) {
        guestScoreboard.classList.add("winner");
    }

    setTimeout(
        () => document.querySelector(".winner").classList.remove("winner"),
        700,
    );
}

function clearScoresEl() {
    document.querySelector("#guest-points").textContent = 0;
    document.querySelector("#home-points").textContent = 0;
}

disablePointerButtons();
// listen to everything clicked on the scoreboards wrapper
scoreboardsWrapper.addEventListener("click", (e) => {
    // handle when points buttons are clicked
    if (e.target.classList.contains("scoreboard-points-btn")) {
        const currentPoints = getCurrentPoint(e);
        const pointsEl = getCurrentPointsText(e);
        pointsEl.textContent = currentPoints;
        addPoints(e, currentPoints);
        updateScore(e);
    }

    if (e.target.id === "start-btn") {
        removeDisablePointerButtons();
        startTimer();
        updateQuarter();
        startBtn.disabled = true;
    }

    if (e.target.id === "play-btn") {
        gameReset();
    }
});
