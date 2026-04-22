var x = 150;
var y = 200;
var dx = 2;
var dy = -4;
var WIDTH;
var HEIGHT;
var r = 10;
var f = 0;
var ctx;
var canvas;
var intervalId;
var timerId;

var paddlecolor = "#ffffff";
var ballcolor = "#ffffff";
var brickcolors = {
    1: "#56e0ff",
    2: "#8d63ff",
    3: "#ff6ba2"
};
var start = false;
var gameStarted = false;
var tocke;
var sekunde;
var izpisTimer;

var paddlex;
var paddleh;
var paddlew;

var rightDown = false;
var leftDown = false;

var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;
var BRICKGAPX;
var BRICKGAPY;
var BRICKOFFSETTOP;
var BRICKOFFSETSIDE;
var currentLevel = 1;
var gamePaused = false;

function resetBall() {
    x = WIDTH / 2;
    y = HEIGHT / 2;
    dx = 0;
    dy = -4;
}

function stopGameLoop() {
    clearInterval(timerId);
    clearInterval(intervalId);
    timerId = null;
    intervalId = null;
}

function startGameLoop() {
    stopGameLoop();
    intervalId = setInterval(draw, 10);
    timerId = setInterval(timer, 1000);
}

function updateResumeButton() {
    $("#resume-btn").text(gamePaused ? "Resume" : "Pause");
}

function toggleGamePause() {
    if (!gameStarted) {
        return;
    }
    gamePaused = !gamePaused;
    start = !gamePaused;
    updateResumeButton();
}

function startGame() {
    if (gameStarted) {
        return;
    }
    gameStarted = true;
    gamePaused = false;
    start = true;
    updateResumeButton();
    startGameLoop();
}

function info() {
    Swal.fire({
        text: "Avtor: Rene Frančeškin",
        icon: "success",
        confirmButtonText: "Igraj"
    });
}

function resetLevel() {
    stopGameLoop();
    resetBall();
    init_paddle();
    initbricks();
    sekunde = 0;
    izpisTimer = "00:00";
    $("#cas").html(izpisTimer);
    gamePaused = false;
    gameStarted = false;
    start = false;
    updateResumeButton();
    drawInitialScene();
}

function showLevelCompleteAlert(completedLevel) {
    gamePaused = true;
    start = false;
    stopGameLoop();
    updateResumeButton();

    Swal.fire({
        title: "Koncal si level " + completedLevel,
        text: "Pojdi v level " + (completedLevel + 1) + ".",
        icon: "success",
        confirmButtonText: "Igraj"
    }).then(function(result) {
        if (result.isConfirmed) {
            nextLevel();
        }
    });
}

function showGameCompletedAlert() {
    gamePaused = true;
    start = false;
    stopGameLoop();
    updateResumeButton();

    Swal.fire({
        title: "Cestitke!",
        text: "Koncal si vse levele.",
        icon: "success",
        confirmButtonText: "Super"
    });
}

function init() {
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    resetBall();
    init_paddle();
    initbricks();
    sekunde = 0;
    izpisTimer = "00:00";
    tocke = 0;
    $("#level").html(currentLevel);
    $("#cas").html(izpisTimer);
    $("#tocke").html(tocke);
    $("#resume-btn").on("click", toggleGamePause);
    $("#start-btn").on("click", startGame);
    $("#reset-btn").on("click", resetLevel);
    $("#info-key").on("click", info);
    gamePaused = false;
    gameStarted = false;
    start = false;
    updateResumeButton();
    drawInitialScene();
}

function drawInitialScene() {
    clear();
    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);
    ctx.fillStyle = ballcolor;
    circle(x, y, 10);
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                ctx.fillStyle = brickcolors[bricks[i][j]];
                rect(
                    BRICKOFFSETSIDE + (j * (BRICKWIDTH + BRICKGAPX)),
                    BRICKOFFSETTOP + (i * (BRICKHEIGHT + BRICKGAPY)),
                    BRICKWIDTH,
                    BRICKHEIGHT
                );
            }
        }
    }
}

function init_paddle() {
    paddlex = WIDTH / 2.27;
    paddleh = 10;
    paddlew = 100;
}

function initbricks() {
    if (currentLevel == 1) {
        NROWS = 2;
        NCOLS = 4;
    } else if (currentLevel == 2) {
        NROWS = 3;
        NCOLS = 5;
    } else if (currentLevel == 3) {
        NROWS = 4;
        NCOLS = 6;
    }
    BRICKGAPX = 28;
    BRICKGAPY = 20;
    BRICKOFFSETTOP = 32;
    BRICKOFFSETSIDE = 20;
    BRICKWIDTH = (WIDTH - (BRICKOFFSETSIDE * 2) - (BRICKGAPX * (NCOLS - 1))) / NCOLS;
    BRICKHEIGHT = 30;
    PADDING = 1;
    bricks = new Array(NROWS);

    for (var i = 0; i < NROWS; i++) {
        bricks[i] = new Array(NCOLS);
        for (var j = 0; j < NCOLS; j++) {
            bricks[i][j] = Math.floor(Math.random() * 4) + 0;
        }
    }
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

function allBricksDestroyed() {
    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                return false;
            }
        }
    }
    return true;
}

function nextLevel() {
    currentLevel++;
    resetBall();
    start = false;
    sekunde = 0;
    izpisTimer = "00:00";
    $("#level").html(currentLevel);
    $("#cas").html(izpisTimer);
    stopGameLoop();
    init_paddle();
    initbricks();
    gamePaused = false;
    gameStarted = false;
    updateResumeButton();
    drawInitialScene();
}

function rect(x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#1c284c";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function timer() {
    var sekundeI;
    var minuteI;

    if (start == true && gamePaused == false) {
        sekunde++;
        sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0" + sekundeI;
        minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0" + minuteI;
        izpisTimer = minuteI + ":" + sekundeI;
        $("#cas").html(izpisTimer);
    } else {
        $("#cas").html(izpisTimer);
    }
}

function onKeyDown(evt) {
    if (evt.keyCode == 39) {
        rightDown = true;
    } else if (evt.keyCode == 37) {
        leftDown = true;
    }
}

function onKeyUp(evt) {
    if (evt.keyCode == 39) {
        rightDown = false;
    } else if (evt.keyCode == 37) {
        leftDown = false;
    }
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function draw() {
    if (gamePaused) {
        return;
    }

    clear();
    ctx.fillStyle = ballcolor;
    circle(x, y, 10);

    if (rightDown) {
        if ((paddlex + paddlew) < WIDTH) {
            paddlex += 5;
        } else {
            paddlex = WIDTH - paddlew;
        }
    } else if (leftDown) {
        if (paddlex > 0) {
            paddlex -= 5;
        } else {
            paddlex = 0;
        }
    }

    ctx.fillStyle = paddlecolor;
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    for (var i = 0; i < NROWS; i++) {
        for (var j = 0; j < NCOLS; j++) {
            if (bricks[i][j] > 0) {
                ctx.fillStyle = brickcolors[bricks[i][j]];
                rect(
                    BRICKOFFSETSIDE + (j * (BRICKWIDTH + BRICKGAPX)),
                    BRICKOFFSETTOP + (i * (BRICKHEIGHT + BRICKGAPY)),
                    BRICKWIDTH,
                    BRICKHEIGHT
                );
            }
        }
    }

    var hitBrick = false;

    for (var i = 0; i < NROWS && !hitBrick; i++) {
        for (var j = 0; j < NCOLS && !hitBrick; j++) {
            if (bricks[i][j] <= 0) {
                continue;
            }

            var brickX = BRICKOFFSETSIDE + (j * (BRICKWIDTH + BRICKGAPX));
            var brickY = BRICKOFFSETTOP + (i * (BRICKHEIGHT + BRICKGAPY));

            if (
                x + r > brickX &&
                x - r < brickX + BRICKWIDTH &&
                y + r > brickY &&
                y - r < brickY + BRICKHEIGHT
            ) {
                dy = -dy;
                bricks[i][j]--;
                tocke++;
                $("#tocke").html(tocke);
                hitBrick = true;

                if (allBricksDestroyed()) {
                    if (currentLevel < 3) {
                        showLevelCompleteAlert(currentLevel);
                    } else {
                        showGameCompletedAlert();
                    }
                    return;
                }
            }
        }
    }

    if (x + dx > WIDTH - r || x + dx < 0 + r) {
        dx = -dx;
    }

    if (y + dy < 0 + r) {
        dy = -dy;
    } else if (y + dy > HEIGHT - (r + f)) {
        start = false;
        if (x > paddlex && x < paddlex + paddlew) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            dy = -dy;
            start = true;
        } else if (y + dy > HEIGHT - r) {
            stopGameLoop();
        }
    }

    x += dx;
    y += dy;
}
