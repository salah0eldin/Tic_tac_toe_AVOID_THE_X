// get DOM elements
const gameBoard = document.getElementById("game");
const cells = document.querySelectorAll(".cell");
const startGameButton = document.getElementById("start-game");
const gameTypeRadios = document.getElementsByName("game-type");
const gameModeRadios = document.getElementsByName("game-mode");
const gridn = document.getElementsByName("gridn");
const messageElement = document.getElementById("game-message");

// game variables
let currentPlayer;
let currentPlayerC;
let currentPlayerCC = "Blue";
let gameType;
let gameMode;
let board;
let togglecount = false;
let endd = true;
let indexs = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

// add event listeners to buttons
startGameButton.addEventListener("click", startGame);

gameModeRadios.forEach((radioo) => {
  radioo.addEventListener('click', () => {
    if (!endd) {
      gameMode = getSelectedRadioValue(gameModeRadios);
      if (gameMode === 'single') {
        currentPlayerCC = currentPlayerC;
        if (gameType === 'regular')
          computerMove();
        else
          computerMoveR();
      }
    }
  })
});

//check if grid number is changed after end
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

let ordermoves = [];

document.getElementById("Undo").addEventListener("click", function () {
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

// start a new game
function startGame() {
  removebestmoves();
  endd = false;
  gridnum = getSelectedRadioValue(gridn);
  if (gridnum === "33")
    window.location.replace("index.html");
  gameType = getSelectedRadioValue(gameTypeRadios);
  gameMode = getSelectedRadioValue(gameModeRadios);
  board = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

  // initialize game variables
  togglecount = !togglecount;

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
    if (gameType === 'regular')
      computerMove();
    else
      computerMoveR();
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
      if (gameType === 'regular')
        computerMove();
      else
        computerMoveR();
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
  let bestScore = -Infinity;
  let move;
 // indexs.sort(() => Math.random() - 0.5);
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
  playMove(move);
}

function minimax(board, depth, isMaximizingPlayer, playerMark, alpha, beta) {
  let opponentMark;
  playerMark === 'X' ? opponentMark = 'O' : opponentMark = 'X';
  if (checkForWinner(board, playerMark)) {
    return 10 - depth;
  } else if (checkForWinner(board, opponentMark)) {
    return depth - 10;
  } else if (depth == 5 || !board.includes('')) {
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

function computerMoveR() {
  let bestScore = -Infinity;
  let move;
  let alpha = -Infinity;
  let beta = Infinity;
  //indexs.sort(() => Math.random() - 0.5);
  for (let i of indexs) {
    if (board[i] === '') {
      board[i] = currentPlayer;
      let score = minimaxR(board, 0, false, alpha, beta);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  playMove(move);
}

function minimaxR(board, depth, isMaximizingPlayer, alpha, beta) {
  if (checkForWinner(board, currentPlayer)) {
    if (isMaximizingPlayer)
      return 10 - depth;
    else
      return depth - 10;
  }
  else if (depth == 5)
    return 0;
  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = currentPlayer;
        const score = minimaxR(board, depth + 1, false, alpha, beta);
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
        board[i] = currentPlayer;
        const score = minimaxR(board, depth + 1, true, alpha, beta);
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

function checkForWinner(board, mark) {
  const winningCombos = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // columns
  [0, 5, 10, 15], [3, 6, 9, 12] // diagonals
  ];

  return winningCombos.some(combo => combo.every(index => board[index] === mark));
}

// check if there is a winner
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // rows
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // columns
    [0, 5, 10, 15], [3, 6, 9, 12] // diagonals
  ];

  let test = false;

  for (let combination of winningCombinations) {

    const [a, b, c, d] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c] && board[a] == board[d]) {
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

let Showbutton = document.getElementById("Show");
let bestmoves = [];

Showbutton.addEventListener("click", function () {
  if (!endd) {
    if (Showbutton.textContent == "Show best move") {
      let bestScore = -Infinity;
      for (let i of indexs) {
        if (board[i] === '') {
          board[i] = currentPlayer;
          let score;
          if (gameType === 'inverse')
            score = minimaxR(board, 0, false, -Infinity, Infinity);
          else
            score = minimax(board, 0, false,currentPlayer, -Infinity, Infinity);
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

function removebestmoves() {
  Showbutton.textContent = "Show best move";
  for (let i = 0; i < 16; i++)
    cells[i].classList.remove('Showb');
}
