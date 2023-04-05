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
let gridnum;
let indexs = [0,1,2,3,4,5,6,7,8];

// add event listeners to buttons
startGameButton.addEventListener("click", startGame);

//check if game type radioo pressed and if single change
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

// start a new game
function startGame() {
  endd = false;
  gridnum = getSelectedRadioValue(gridn);
  if (gridnum === "44")
    window.location.replace("index44.html");
  gameType = getSelectedRadioValue(gameTypeRadios);
  gameMode = getSelectedRadioValue(gameModeRadios);
  board = ["", "", "", "", "", "", "", "", ""];

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
  for (let i = 0; i < 9; i++) {
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
  } else if (!board.includes('')) {
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
  let bestScore = Infinity;
  let move;
  indexs.sort(() => Math.random() - 0.5);
  for (let i of indexs) {
    if (board[i] === '') {
      board[i] = currentPlayer;
      let score = minimaxR(board, 0, false);
      board[i] = '';
      if (score < bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  playMove(move);
}

function minimaxR(board, depth, isMinimizingPlayer) {
  if (checkForWinner(board, currentPlayer)) {
    if (!isMinimizingPlayer)
      return 10 - depth;
    else
      return depth - 10;
  }
  else if (!board.includes(''))
    return 0;
  if (isMinimizingPlayer) {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = currentPlayer;
        const score = minimaxR(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.min(bestScore, score);
      }
    }
    return bestScore;
  } else {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = currentPlayer;
        const score = minimaxR(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.max(bestScore, score);
      }
    }
    return bestScore;
  }

}

function checkForWinner(board, mark) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  return winningCombos.some(combo => combo.every(index => board[index] === mark));
}

// check if there is a winner
function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let test = false;

  for (let combination of winningCombinations) {

    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
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
