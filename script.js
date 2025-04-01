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

  const addMark = (x, y, player) => {
    board[x][y].mark(player);
  };

  const printBoard = () => {
    const boardWithValues = board.map((rows) =>
      rows.map((box) => box.getValue())
    );
    console.log(boardWithValues);
  };

  return { getBoard, addMark, printBoard };
}

function Box() {
  let value;

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

  const playRound = (x, y) => {
    if (!board.getBoard()[x][y].getValue()) {
      board.addMark(x, y, getActivePlayer().mark);
      switchPlayerTurn();
      newRound();
    }
  };
  newRound();

  return { getActivePlayer, playRound, getBoard: board.getBoard };
}

function displayController() {
  const game = Gameplay();
  const boardDisplay = document.querySelector(".board");

  const updateScreen = () => {
    boardDisplay.textContent = "";

    const turnText = document.querySelector(".turn");
    const activePlayer = game.getActivePlayer();
    turnText.textContent = `${activePlayer.name}'s turn`;

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
