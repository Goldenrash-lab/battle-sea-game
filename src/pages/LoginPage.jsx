import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [invitationGame, setInvitationGame] = useState("");
  const [gameId, setGameId] = useState("");
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const startPlay = (e) => {
    e.preventDefault();
    if (nickname && gameId) {
      localStorage.nickname = nickname;
      navigate("/game/" + gameId);
    }
  };

  return (
    <div>
      <h2>Авторизация</h2>
      <form onSubmit={startPlay}>
        <div>
          <div>
            <label>Ваше имя</label>
          </div>
          <input
            type="text"
            name="nickname"
            id="nickname"
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div
          onChange={(e) => {
            setInvitationGame(e.target.id === "ingame");
          }}
        >
          <input
            type="radio"
            name="typeEnter"
            id="gen"
            value={!invitationGame}
            defaultChecked={!invitationGame}
          />
          <label htmlFor="gen">Создать игру</label>
          <input
            type="radio"
            name="typeEnter"
            id="ingame"
            value={invitationGame}
            defaultChecked={invitationGame}
          />
          <label htmlFor="ingame">Войти в игру по идентификатору</label>
        </div>
        <div>
          {invitationGame ? (
            <>
              <div>
                <label htmlFor="gameId">Введите идентификатор игры</label>
              </div>
              <input
                type="text"
                name="gameId"
                id="gameId"
                defaultValue=""
                onChange={(e) => setGameId(e.target.value)}
              />
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setGameId(Date.now());
                }}
              >
                Сгенерировать идентификатор игры
              </button>
              <p>{gameId}</p>
            </>
          )}
        </div>

        <button type="submit">ИГРАТЬ</button>
      </form>
    </div>
  );
};

export default LoginPage;
