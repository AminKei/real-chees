import { Button, Layout, Typography, Modal } from "antd";
import { pieceImages } from "./PieceImages";
import useChess from "./Models/Hook/useChees";

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const {
    board,
    currentPlayer,
    gameOver,
    setGameOver,
    winner,
    draggedPiece,
    capturedPieces,
    handleDragStart,
    handleDragOver,
    handleDrop,
    resetGame,
  } = useChess();

  const isMobile = window.innerWidth <= 768;
  const squareSize = isMobile ? 40 : 60;
  const pieceSize = isMobile ? 30 : 45;
  const capturedPieceSize = isMobile ? 15 : 20;

  return (
    <Layout
      className="chess-game"
      style={{ background: "#ffffff", padding: isMobile ? "10px" : "20px" }}
    >
      <Header
        style={{
          borderRadius: "8px",
          marginBottom: "20px",
          display: "flex",
          color:"white",
          justifyContent: "space-around",
          padding: isMobile ? "10px" : "0px",
          alignItems: "center",
          backgroundColor:"#853b07"
        }}
      >
        <Title level={isMobile ? 4 : 2} style={{color:"white", marginTop:"10px"}}>CHEES</Title>
        <Typography style={{ fontSize: isMobile ? "12px" : "16px" , color:"white"}}>
          Current Turn: {currentPlayer === "white" ? "White" : "Black"}
        </Typography>
        <Button type="dashed" onClick={resetGame} >
          New Game
        </Button>
      </Header>
      <Content
        className="game-content"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "10px" : "20px",
        }}
      >
        <div
          className="captured-pieces"
          style={{
            width: isMobile ? "100%" : "150px",
            background: "#fff",
            padding: "8px",
            height: "100%",
            borderRadius: "8px",
          }}
        >
          <div className="white-captured" >
            White Captured:{" "}
            {capturedPieces.white.map((piece, index) => (
              <img
                key={index}
                src={pieceImages[piece as keyof typeof pieceImages]}
                alt={piece}
                style={{
                  width: `${capturedPieceSize}px`,
                  height: `${capturedPieceSize}px`,
                }}
              />
            ))}
          </div>
        </div>
        <div
          className="chess-board"
          style={{
            background: "#8B4513",
            padding: isMobile ? "5px" : "10px",
            borderRadius: "8px",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            marginTop: "90px",
          }}
        >
          {board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="board-row"
              style={{ display: "flex" }}
            >
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`square ${
                    draggedPiece?.row === rowIndex &&
                    draggedPiece?.col === colIndex
                      ? "dragging"
                      : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                  style={{
                    width: `${squareSize}px`,
                    height: `${squareSize}px`,
                    background:
                      (rowIndex + colIndex) % 2 === 0 ? "#FFEBCD" : "#8B4513",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {piece && (
                    <img
                      src={pieceImages[piece as keyof typeof pieceImages]}
                      alt={piece}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, rowIndex, colIndex)
                      }
                      style={{
                        width: `${pieceSize}px`,
                        height: `${pieceSize}px`,
                        cursor: "grab",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className="captured-pieces"
          style={{
            width: isMobile ? "100%" : "150px",
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <div className="black-captured">
            Black Captured:{" "}
            {capturedPieces.black.map((piece, index) => (
              <img
                key={index}
                src={pieceImages[piece as keyof typeof pieceImages]}
                alt={piece}
                style={{
                  width: `${capturedPieceSize}px`,
                  height: `${capturedPieceSize}px`,
                }}
              />
            ))}
          </div>
        </div>
      </Content>
      <Modal
        title="Game Over"
        open={gameOver}
        onOk={resetGame}
        onCancel={() => setGameOver(false)}
      >
        <p>{winner.charAt(0).toUpperCase() + winner.slice(1)} wins!</p>
      </Modal>
    </Layout>
  );
};

export default App;
