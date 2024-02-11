const ActionInfo = ({ shipsReady = false, canShoot = false, ready }) => {
  if (!shipsReady) {
    return (
      <button className="btn-ready" onClick={ready}>
        Корбали готовы
      </button>
    );
  }

  return <div>{canShoot ? <p>Стреляй</p> : <p>Выстрел соперника</p>}</div>;
};

export default ActionInfo;
