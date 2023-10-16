import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, col, row, setCurrentPosition }) {
  function handleClick(i, _row, _col) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
    setCurrentPosition(_row, _col);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function RenderBoard() {
    return Array(row)
      .fill(0)
      .map((_, index1) => {
        return (
          <div className="board-row" key={index1}>
            {Array(col)
              .fill(0)
              .map((_, index2) => {
                const current = index1 * row + index2;
                return (
                  <Square
                    key={index2}
                    value={squares[current]}
                    onSquareClick={() => handleClick(current, index1, index2)}
                  />
                );
              })}
          </div>
        );
      });
  }

  return (
    <>
      <div className="status">{status}</div>
      {RenderBoard()}
    </>
  );
}

export default function Game() {
  const [isAscending, setIsAscending] = useState(true); // [1
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [position, setPosition] = useState(Array(9).fill({ x: 0, y: 0 }));
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move === currentMove) {
        description =
          "You are at (" +
          position[move - 1].x +
          "," +
          position[move - 1].y +
          ")";
      } else {
        description =
          "Go to move (" +
          position[move - 1].x +
          "," +
          position[move - 1].y +
          ")";
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button
          className={move === currentMove ? "bold" : ""}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  const handleRenderMove = () => {
    setIsAscending(!isAscending);
  };

  const setCurrentPosition = (row, col) => {
    console.log(row, col);
    const nextPosition = [...position];
    nextPosition[currentMove] = { x: row, y: col };

    // console.log(nextPosition);
    setPosition(nextPosition);
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          setCurrentPosition={setCurrentPosition}
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          col={3}
          row={3}
        />
      </div>
      <div className="game-info">
        <ol>{isAscending ? moves : moves.reverse()}</ol>
      </div>
      <div className="game-info">
        <button onClick={() => handleRenderMove()}>
          {isAscending ? "Ascending" : "Descending"}
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
