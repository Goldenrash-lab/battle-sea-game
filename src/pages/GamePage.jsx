import { useNavigate, useParams } from "react-router-dom";
import { Board } from "../models/Board";
import { useEffect, useState } from "react";
import BoardComponent from "../components/BoardComponent";
import ActionInfo from "../components/ActionInfo";

const wss = new WebSocket("ws://localhost:4000");

const GamePage = () => {
  const { gameId } = useParams();

  const [myBoard, setMyBoard] = useState(new Board());
  const [hisBoard, setHisBoard] = useState(new Board());
  const [rivalName, setRivalName] = useState("");
  const [shipsReady, setShipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);
  const navigate = useNavigate();

  function restart() {
    const newMyBoard = new Board();
    const newHisBoard = new Board();

    newMyBoard.initCells();
    newHisBoard.initCells();

    setMyBoard(newMyBoard);
    setHisBoard(newHisBoard);
  }

  function shoot(x, y) {
    wss.send(
      JSON.stringify({
        event: "connect",
        payload: { username: localStorage.nickname, x, y, gameId },
      })
    );
  }

  wss.onmessage = function (response) {
    const { type, payload } = JSON.parse(response.data);

    const { username, x, y, canStart, rivalName, success } = payload;
    switch (type) {
      case "connectToPlay":
        if (!success) {
          return navigate("/");
        }
        setRivalName(rivalName);

        break;
      case "readyToPlay":
        if (payload.username === localStorage.nickname && canStart) {
          setCanShoot(true);
        }
        break;
      case "afterShootByMe":
        // console.log("afterShoot", username !== localStorage.nickname);
        if (username !== localStorage.nickname) {
          const isPerfectHit = myBoard.cells[y][x].mark?.name === "ship";
          changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit);
          wss.send(
            JSON.stringify({
              event: "checkShoot",
              payload: { ...payload, isPerfectHit },
            })
          );
          if (!isPerfectHit) {
            setCanShoot(true);
          }
        }
        break;
      case "isPerfectHit":
        if (username === localStorage.nickname) {
          changeBoardAfterShoot(
            hisBoard,
            setHisBoard,
            x,
            y,
            payload.isPerfectHit
          );
          payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false);
        }
        break;

      default:
        break;
    }
  };

  function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
    isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y);
    const newBoard = board.getCopyBoard();
    setBoard(newBoard);
  }

  function ready() {
    wss.send(
      JSON.stringify({
        event: "ready",
        payload: { username: localStorage.nickname, gameId },
      })
    );
    setShipsReady(true);
  }

  useEffect(() => {
    wss.send(
      JSON.stringify({
        event: "connect",
        payload: { username: localStorage.nickname, gameId },
      })
    );

    restart();
  }, [gameId]);
  return (
    <div className="container">
      <p>ДОБРО ПОЖАЛОВАТЬ В ИГРУ</p>
      <div className="board__container">
        <div className="board__wrapper">
          <p className="nick">{localStorage.nickname}</p>
          <BoardComponent
            board={myBoard}
            isMyBoard
            shipsReady={shipsReady}
            setBoard={setMyBoard}
            canShoot={false}
          />
        </div>
        <div className="board__wrapper">
          <p className="nick">{rivalName || "Соперник неизвестен"}</p>
          <BoardComponent
            board={hisBoard}
            setBoard={setHisBoard}
            canShoot={canShoot}
            shipsReady={shipsReady}
            shoot={shoot}
          />
        </div>
      </div>
      <ActionInfo ready={ready} canShoot={canShoot} shipsReady={shipsReady} />
    </div>
  );
};

export default GamePage;
