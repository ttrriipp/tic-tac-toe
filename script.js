function GameBoard() {
  //create the board
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Box());
    }
  }

  const getBoard = () => board;

  const getRows = () => rows;
  const getColumns = () => columns;

  const addMark = (x, y, player) => {
    board[x][y].mark(player);
  };

  const printBoard = () => {
    const boardWithValues = board.map((rows) =>
      rows.map((box) => box.getValue())
    );
    console.log(boardWithValues);
  };

  return { getBoard, addMark, printBoard, getRows, getColumns };
}

function Box() {
  let value = "";

  const mark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { mark, getValue };
}

function Gameplay(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = GameBoard();
  const players = [
    {
      name: playerOneName,
      mark: "O",
    },
    {
      name: playerTwoName,
      mark: "X",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const newRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  };

  let gameOver = false;
  const isGameOver = () => gameOver;
  let winner;
  const getWinner = () => winner;
  const checkWinner = () => {
    const rows = board.getRows();
    const columns = board.getColumns();
    const boardGrid = board.getBoard();

    //horizontal check
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns - 2; j++) {
        if (
          boardGrid[i][j].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i][j + 1].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i][j + 2].getValue()
        ) {
          winner = activePlayer.name;
          gameOver = true;
          return;
        }
      }
    }

    //vertical check
    for (let j = 0; j < columns; j++) {
      for (let i = 0; i < rows - 2; i++) {
        if (
          boardGrid[i][j].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 1][j].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 2][j].getValue()
        ) {
          winner = activePlayer.name;
          gameOver = true;
          return;
        }
      }
    }

    //diagonal check
    for (let i = 0; i < rows - 2; i++) {
      for (let j = 0; j < columns - 2; j++) {
        if (
          boardGrid[i][j].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 1][j + 1].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 2][j + 2].getValue()
        ) {
          winner = activePlayer.name;
          gameOver = true;
          return;
        }
      }
    }

    //anti diagonal check
    for (let i = 0; i < rows - 2; i++) {
      for (let j = 2; j < columns; j++) {
        if (
          boardGrid[i][j].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 1][j - 1].getValue() &&
          boardGrid[i][j].getValue() === boardGrid[i + 2][j - 2].getValue()
        ) {
          winner = activePlayer.name;
          gameOver = true;
          return;
        }
      }
    }

    const allBoxHaveValues = boardGrid.every((row) =>
      row.every((box) => box.getValue() != "")
    );
    if (allBoxHaveValues) gameOver = true;
  };

  const playRound = (x, y) => {
    const boxValue = board.getBoard()[x][y].getValue();
    if (!boxValue && !gameOver) {
      board.addMark(x, y, getActivePlayer().mark);
      //check winner
      checkWinner();
      switchPlayerTurn();
      newRound();
    }
  };
  newRound();

  return {
    getActivePlayer,
    playRound,
    getBoard: board.getBoard,
    isGameOver,
    getWinner,
  };
}

function displayController() {
  const game = Gameplay();
  const boardDisplay = document.querySelector(".board");

  const updateScreen = () => {
    boardDisplay.textContent = "";

    const turnText = document.querySelector(".turn");
    const activePlayer = game.getActivePlayer();
    if (game.isGameOver() && game.getWinner()) {
      turnText.textContent = `${game.getWinner()} wins!`;
    } else if (game.isGameOver()) {
      turnText.textContent = `It's a tie!`;
    } else turnText.textContent = `${activePlayer.name}'s turn`;

    const board = game.getBoard();

    //display board
    board.forEach((rows, x) => {
      rows.forEach((box, y) => {
        const newBox = document.createElement("button");
        newBox.classList.add("box");
        newBox.dataset.row = x;
        newBox.dataset.column = y;
        newBox.textContent = box.getValue();
        boardDisplay.appendChild(newBox);
      });
    });
  };

  function clickHandler(e) {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    if (!row && !column) return;

    game.playRound(row, column);
    updateScreen();
  }
  boardDisplay.addEventListener("click", clickHandler);

  updateScreen();
}

displayController();
