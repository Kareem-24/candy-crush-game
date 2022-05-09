import { useEffect, useState } from "react";
import ScoreBOard from "./components/ScoreBOard";
import "./index.css";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";

const width = 8;
const candyColor = [
  blueCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
  greenCandy,
];

const App = () => {
  const [currentColorArray, setCurrentColorArray] = useState([]);
  const [draggedSquare, setDraggedSquare] = useState(null);
  const [replacedSquare, setReplacedSquare] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  // creating an array for every cell on the board ( 64 cell) with random colors
  const createBoard = () => {
    const randomColorsArray = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColor[Math.floor(Math.random() * candyColor.length)];
      randomColorsArray.push(randomColor);
    }
    setCurrentColorArray(randomColorsArray);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArray[i];
      const isBlank = currentColorArray[i] === blank;
      if (
        columnOfFour.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach((square) => (currentColorArray[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArray[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArray[i] === blank;
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((square) => (currentColorArray[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForColumnThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArray[i];
      const isBlank = currentColorArray[i] === blank;
      if (
        columnOfThree.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach((square) => (currentColorArray[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArray[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArray[i] === blank;
      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (square) => currentColorArray[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach((square) => (currentColorArray[square] = blank));
        return true;
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArray[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColor.length);
        currentColorArray[i] = candyColor[randomNumber];
      }

      if (currentColorArray[i + width] === blank) {
        currentColorArray[i + width] = currentColorArray[i];
        currentColorArray[i] = blank;
      }
    }
  };
  const dragStart = (e) => {
    setDraggedSquare(e.target);
  };

  const dragDrop = (e) => {
    setReplacedSquare(e.target);
  };

  const dragEnd = (e) => {
    const replacedSquareId = parseInt(replacedSquare.getAttribute("data-id"));
    const draggedSquareId = parseInt(draggedSquare.getAttribute("data-id"));
    currentColorArray[replacedSquareId] = draggedSquare.getAttribute("src");
    currentColorArray[draggedSquareId] = replacedSquare.getAttribute("src");
    const validMoves = [
      draggedSquareId - 1,
      draggedSquareId - width,
      draggedSquareId + 1,
      draggedSquareId + width,
    ];
    const validMove = validMoves.includes(replacedSquareId);
    const isAcloumnOfFour = checkForColumnFour();
    const isAcolumnOfThree = checkForColumnThree();
    const isArowOfFour = checkForRowOfFour();
    const isARowOFThree = checkForRowOfThree();
    if (
      replacedSquareId &&
      validMove &&
      (isAcloumnOfFour || isAcolumnOfThree || isArowOfFour || isARowOFThree)
    ) {
      setDraggedSquare(null);
      setReplacedSquare(null);
    } else {
      currentColorArray[replacedSquareId] = replacedSquare.getAttribute("src");
      currentColorArray[draggedSquareId] = draggedSquare.getAttribute("src");
    }
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnFour();
      checkForRowOfFour();
      checkForColumnThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArray([...currentColorArray]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnFour,
    checkForRowOfFour,
    checkForColumnThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArray,
  ]);

  return (
    <div className="app">
      <div className="game-board">
        {currentColorArray.map((candyColor, i) => (
          <img
            key={i}
            src={candyColor}
            alt=""
            data-id={i}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBOard score={scoreDisplay} />
    </div>
  );
};

export default App;
