import { useState } from "react";
import { Position } from "../PositionModel";

const isValidMove = (
  piece: string,
  start: Position,
  end: Position,
  board: string[][]
) => {
  const dx = end.col - start.col;
  const dy = end.row - start.row;
  const pieceType = piece.toLowerCase();

  if (board[end.row][end.col]) {
    const startPieceIsWhite = piece === piece.toUpperCase();
    const endPieceIsWhite =
      board[end.row][end.col] === board[end.row][end.col].toUpperCase();
    if (startPieceIsWhite === endPieceIsWhite) return false;
  }

  switch (pieceType) {
    case "p": {
      const direction = piece === "P" ? -1 : 1;
      const startRow = piece === "P" ? 6 : 1;

      if (dx === 0 && dy === direction && !board[end.row][end.col]) return true;

      if (
        dx === 0 &&
        dy === 2 * direction &&
        start.row === startRow &&
        !board[end.row][end.col] &&
        !board[start.row + direction][start.col]
      )
        return true;

      if (Math.abs(dx) === 1 && dy === direction && board[end.row][end.col])
        return true;

      return false;
    }
    case "r":
      return (dx === 0 || dy === 0) && !hasObstacles(start, end, board);
    case "n":
      return (
        (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
        (Math.abs(dx) === 1 && Math.abs(dy) === 2)
      );
    case "b":
      return Math.abs(dx) === Math.abs(dy) && !hasObstacles(start, end, board);
    case "q":
      return (
        (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) &&
        !hasObstacles(start, end, board)
      );
    case "k":
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    default:
      return false;
  }
};

const hasObstacles = (start: Position, end: Position, board: string[][]) => {
  const dx = Math.sign(end.col - start.col);
  const dy = Math.sign(end.row - start.row);
  let currentRow = start.row + dy;
  let currentCol = start.col + dx;

  while (currentRow !== end.row || currentCol !== end.col) {
    if (board[currentRow][currentCol] !== "") return true;
    currentRow += dy;
    currentCol += dx;
  }

  return false;
};

const isKingInCheck = (board: string[][], isWhiteKing: boolean) => {
  let kingPos = { row: 0, col: 0 };
  const kingPiece = isWhiteKing ? "K" : "k";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === kingPiece) {
        kingPos = { row: i, col: j };
        break;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece) continue;
      const isPieceWhite = piece === piece.toUpperCase();
      if (isPieceWhite === isWhiteKing) continue;

      if (isValidMove(piece, { row: i, col: j }, kingPos, board)) {
        return true;
      }
    }
  }
  return false;
};

const useChess = () => {
  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  const [board, setBoard] = useState<string[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">(
    "white"
  );
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");
  const [draggedPiece, setDraggedPiece] = useState<Position | null>(null);
  const [capturedPieces, setCapturedPieces] = useState<{
    white: string[];
    black: string[];
  }>({
    white: [],
    black: [],
  });

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    const piece = board[row][col];
    if (!piece) return;

    const isWhitePiece = piece === piece.toUpperCase();
    if (
      (currentPlayer === "white" && isWhitePiece) ||
      (currentPlayer === "black" && !isWhitePiece)
    ) {
      setDraggedPiece({ row, col });
      e.dataTransfer.setData("text/plain", "");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const piece = board[draggedPiece.row][draggedPiece.col];
    if (isValidMove(piece, draggedPiece, { row, col }, board)) {
      const newBoard = JSON.parse(JSON.stringify(board));
      const capturedPiece = newBoard[row][col];

      newBoard[row][col] = board[draggedPiece.row][draggedPiece.col];
      newBoard[draggedPiece.row][draggedPiece.col] = "";

      const isWhiteMove = currentPlayer === "white";
      if (isKingInCheck(newBoard, isWhiteMove)) {
        setDraggedPiece(null);
        return;
      }

      if (capturedPiece) {
        const isWhitePiece = capturedPiece === capturedPiece.toUpperCase();
        setCapturedPieces((prev) => ({
          ...prev,
          [isWhitePiece ? "black" : "white"]: [
            ...prev[isWhitePiece ? "black" : "white"],
            capturedPiece,
          ],
        }));
      }

      setBoard(newBoard);

      if (isKingInCheck(newBoard, !isWhiteMove)) {
        let isCheckmate = true;
        if (isCheckmate) {
          setGameOver(true);
          setWinner(currentPlayer);
        }
      }

      setDraggedPiece(null);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    }
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setDraggedPiece(null);
    setCurrentPlayer("white");
    setGameOver(false);
    setWinner("");
    setCapturedPieces({ white: [], black: [] });
  };

  return {
    board,
    currentPlayer,
    gameOver,
    winner,
    draggedPiece,
    capturedPieces,
    handleDragStart,
    handleDragOver,
    handleDrop,
    resetGame,
    setGameOver,
  };
};

export default useChess;
