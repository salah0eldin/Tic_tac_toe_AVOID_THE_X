// get DOM elements
const bodyId = document.body.id; // 3*3 or 4*4
const cells = document.querySelectorAll(".cell");
const startGameButton = document.getElementById("start-game");
const undoButton = document.getElementById("Undo");
const Showbutton = document.getElementById("Show");
const gameTypeRadios = document.getElementsByName("game-type"); // regular or reverse radios
const gameModeRadios = document.getElementsByName("game-mode"); // single or two-players radios
const gridn = document.getElementsByName("gridn"); // 3*3 or 4*4 radios
const messageElement = document.getElementById("game-message");
const withAlphaBeta = document.querySelector('.with');
const withoutAlphaBeta = document.querySelector('.without');

// game variables
let currentPlayer; // X or O
let currentPlayerC; // Blue or Black
let currentPlayerCC = "Blue"; // computer color player
let gameType; // regular or reverse
let gameMode; // single or two-players
let togglecount = false; // how playes first
let endd = true; // if game is end
let gridnum; // 3*3 or 4*4
let numberOfIteratoins = 0;
let ordermoves = []; // records the history of moves
let board = [];
let indexs = [];
let winningCombos = [];
let bestmoves = [];

// add event listeners to buttons
startGameButton.addEventListener("click", startGame);

// start a new game
function startGame() {


    withAlphaBeta.textContent = 0;
    withoutAlphaBeta.textContent = 0;

    removebestmoves();
    endd = false;
    togglecount = !togglecount;

    gridnum = getSelectedRadioValue(gridn);
    gameType = getSelectedRadioValue(gameTypeRadios);
    gameMode = getSelectedRadioValue(gameModeRadios);

    if (gridnum === "44" && bodyId === "3*3")
        window.location.replace("index44.html");
    else if (gridnum === "33" && bodyId === "4*4")
        window.location.replace("index.html");

    if (bodyId === "3*3") {
        board = ["", "", "", "", "", "", "", "", ""];
        indexs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];
    }
    else {
        board = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
        indexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        winningCombos = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
        [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // columns
        [0, 5, 10, 15], [3, 6, 9, 12] // diagonals
        ];
    }

    if (togglecount % 2) {
        currentPlayer = "X";
        currentPlayerC = "Black";
    } else {
        if (gameType === "regular") currentPlayer = "O";
        else currentPlayer = "X";
        currentPlayerC = "Blue";
    }
    currentPlayerCC = "Blue";
    // clear board and add event listeners to cells
    cells.forEach((cell) => {
        cell.textContent = "";
        cell.style.color = 'black';
        cell.classList.remove('redblue');
        cell.classList.remove('redblack');
        cell.addEventListener("click", handleCellClick);
    });

    // update game message
    if (gameType === "regular")
        updateGameMessage(`Player ${currentPlayer}'s turn`);
    else updateGameMessage(`${currentPlayerC}'s turn`);

    // if single player mode, let computer make the first move
    if (gameMode === "single" && currentPlayerC === currentPlayerCC) {
        computerMove();
    }
}

// play a move
function playMove(index) {

    removebestmoves();

    ordermoves.push(index);
    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    if (currentPlayerC === "Blue")
        cells[index].style.color = 'blue';

    // check for winner
    const winner = checkWinner();
    if (winner) {
        endGame(winner);
    } else if (board.indexOf("") === -1) {
        endGame("tie");
    } else {
        // switch players
        if (gameType === "regular")
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerC = currentPlayerC === "Black" ? "Blue" : "Black";

        // if single player mode, let computer make a move
        if (gameMode === 'single' && currentPlayerC === currentPlayerCC)
            computerMove();
        // update game message
        if (!endd)
            if (gameType === "regular")
                updateGameMessage(`Player ${currentPlayer}'s turn`);
            else
                updateGameMessage(`${currentPlayerC}'s turn`);
    }
}

// function computer move
function computerMove() {
    numberOfIteratoins = 0;
    let bestScore = -Infinity;
    let move;
    let tempcurrentplayer = currentPlayer;
    //indexs.sort(() => Math.random() - 0.5);
    for (let i of indexs) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            const score = minimax(board, 0, false, currentPlayer, -Infinity, Infinity);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    withAlphaBeta.textContent = numberOfIteratoins;
    console.log(withAlphaBeta.textContent);
    playMove(move);
    numberOfIteratoins = 0;
    board[move] = '';
    for (let i of indexs) {
        if (board[i] === '') {
            board[i] = currentPlayer;
            const score = minimaxonly(board, 0, false, currentPlayer);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = tempcurrentplayer;
    withoutAlphaBeta.textContent = numberOfIteratoins;
}

// minimax wtih alpha beta function
function minimax(board, depth, isMaximizingPlayer, playerMark, alpha, beta) {
    numberOfIteratoins++;
    let opponentMark = 'X';
    if (gameType === 'regular') {
        playerMark === 'X' ? opponentMark = 'O' : opponentMark = 'X';

        if (checkBoard(board, playerMark)) {
            return 10 - depth;
        } else if (checkBoard(board, opponentMark)) {
            return depth - 10;
        } else if (!board.includes('') || (depth === 5 && gridnum === "44")) {
            return 0;
        }
    }
    else {
        if (checkBoard(board, currentPlayer)) {
            if (isMaximizingPlayer)
                return 10 - depth;
            else
                return depth - 10;
        }
        else if (depth === 5 && gridnum === "44")
            return 0;
    }
    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = playerMark;
                const score = minimax(board, depth + 1, false, playerMark, alpha, beta);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = opponentMark;
                const score = minimax(board, depth + 1, true, playerMark, alpha, beta);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break;
                }
            }
        }
        return bestScore;
    }
}

// minimax function only
function minimaxonly(board, depth, isMaximizingPlayer, playerMark) {
    numberOfIteratoins++;
    let opponentMark = 'X';
    if (gameType === 'regular') {
        playerMark === 'X' ? opponentMark = 'O' : opponentMark = 'X';

        if (checkBoard(board, playerMark)) {
            return 10 - depth;
        } else if (checkBoard(board, opponentMark)) {
            return depth - 10;
        } else if (!board.includes('') || (depth === 5 && gridnum === "44")) {
            return 0;
        }
    }
    else {
        if (checkBoard(board, currentPlayer)) {
            if (isMaximizingPlayer)
                return 10 - depth;

            else
                return depth - 10;
        }
        else if (depth === 5 && gridnum === "44")
            return 0;
    }
    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = playerMark;
                const score = minimaxonly(board, depth + 1, false, playerMark);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = opponentMark;
                const score = minimaxonly(board, depth + 1, true, playerMark);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
}

// checks if there is a 3 or 4 in a row
function checkBoard(board, mark) {
    return winningCombos.some(combo => combo.every(index => board[index] === mark));
}


// check if there is a winner
function checkWinner() {

    let test = false;
    let condition = false;
    for (let combination of winningCombos) {
        if (gridnum === "33") {
            const [a, b, c] = combination;
            condition = board[a] && board[a] === board[b] && board[a] === board[c];
        }
        else {
            const [a, b, c, d] = combination;
            condition = board[a] && board[a] === board[b] && board[a] === board[c] && board[a] == board[d];
        }

        if (condition) {
            test = true;
            if (gameType === "inverse")
                setTimeout(function () {
                    for (let x of combination) {
                        let cellcolor = window.getComputedStyle(cells[x]).getPropertyValue('color');
                        if (cellcolor === 'rgb(0, 0, 0)')
                            cells[x].classList.add('redblack');
                        else
                            cells[x].classList.add('redblue');
                    }
                }, 300);
            else
                for (let x of combination)
                    cells[x].style.color = 'red';
        }
    }
    return test;
}

// end the game
function endGame(winner) {
    endd = true;
    // remove event listeners from cells
    cells.forEach((cell) => {
        cell.removeEventListener("click", handleCellClick);
    });

    // update game message
    if (winner === "tie") {
        updateGameMessage("It is a tie!");
    } else {
        if (gameType === "regular") updateGameMessage(`Player ${currentPlayer} wins!`);
        else updateGameMessage(`${currentPlayerC} loses!`);
    }
}

// get the value of the selected radio button
function getSelectedRadioValue(radios) {
    for (let radio of radios) {
        if (radio.checked) {
            return radio.value;
        }
    }
}

// update the game message
function updateGameMessage(message) {
    messageElement.textContent = message;
}

//changing content when click
function handleCellClick() {
    const index = Array.from(cells).indexOf(this);
    if (this.textContent === "") {
        playMove(index);
    }
}

// show the best moves function
Showbutton.addEventListener("click", function () {
    if (!endd) {
        if (Showbutton.textContent == "Show best move") {
            bestmoves = [];
            let bestScore = -Infinity;
            for (let i of indexs) {
                if (board[i] === '') {
                    board[i] = currentPlayer;
                    let score = minimax(board, 0, false, currentPlayer, -Infinity, Infinity);
                    board[i] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestmoves = [];
                        bestmoves.push(i);
                    }
                    else if (score == bestScore)
                        bestmoves.push(i);
                }
            }
            Showbutton.textContent = "Hide best move";
            for (let i of bestmoves)
                cells[i].classList.add('Showb');
        }
        else
            removebestmoves();
    }
});

// remove best moves function
function removebestmoves() {
    Showbutton.textContent = "Show best move";
    for (let i = 0; i < board.length; i++)
        cells[i].classList.remove('Showb');
}

//check if grid number (3*3 or 4*4) is changed after end
gridn.forEach((gridd) => {
    gridd.addEventListener('click', () => {
        if (endd) {
            gridnum = getSelectedRadioValue(gridn);
            if (gridnum === "33")
                window.location.replace("index.html");
            else
                window.location.replace("index44.html");
        }
    })
});

//check if game type radioo pressed and if single change
gameModeRadios.forEach((radioo) => {
    radioo.addEventListener('click', () => {
        if (!endd) {
            gameMode = getSelectedRadioValue(gameModeRadios);
            if (gameMode === 'single') {
                currentPlayerCC = currentPlayerC;
                computerMove();
            }
            else {
                withAlphaBeta.textContent = 0;
                withoutAlphaBeta.textContent = 0;
            }
        }
    })
});

// undo functoin
undoButton.addEventListener("click", function () {
    
    withAlphaBeta.textContent = 0;
    withoutAlphaBeta.textContent = 0;
    
    removebestmoves();
    let n = 1;
    if ((currentPlayerCC === currentPlayerC || !endd) && gameMode === 'single')
        n = 2;

    if ((n === 1 && !endd) || (n == 2 && endd)) {
        if (gameType === 'regular')
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerC = currentPlayerC === "Black" ? "Blue" : "Black";
    }
    if (gameType === "regular")
        updateGameMessage(`Player ${currentPlayer}'s turn`);
    else
        updateGameMessage(`${currentPlayerC}'s turn`);
    for (; n > 0; n--) {
        let x = ordermoves.pop();
        board[x] = '';
        cells[x].textContent = "";
        cells[x].style.color = 'black';
        if (endd) {
            endd = false;
            cells.forEach((cell) => {
                cell.classList.remove('redblue');
                cell.classList.remove('redblack');
                cell.addEventListener("click", handleCellClick);
            });
            if (gameType === 'regular')
                cells.forEach((cell) => {
                    if (cell.textContent === 'X')
                        cell.style.color = 'black';
                    else if (cell.textContent == 'O')
                        cell.style.color = 'blue';
                });
        }
    }
});
