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
  let value = 0; // 1=x and 2=o

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
      mark: 1,
    },
    {
      name: playerTwoName,
      mark: 2,
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
    board.addMark(x, y, getActivePlayer().mark);

    switchPlayerTurn();
    newRound();
  };
  newRound();

  return { getActivePlayer, playRound };
}

Gameplay();
