const CellComponent = ({ cell, addMark }) => {
  const cellClasses = ["cell"];
  console.log(cell);

  cellClasses.push(cell?.mark?.color);

  return (
    <div
      className={cellClasses.join(" ")}
      onClick={() => addMark(cell.x, cell.y)}
    >
      {cell?.mark?.name === "miss" ? (
        <div>1</div>
      ) : (
        // <span>{cell?.mark?.logo}</span>
        <span>2</span>
      )}
    </div>
  );
};

export default CellComponent;
