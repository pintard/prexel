import { useEffect, useState } from "react";
import GridCell from "./GridCell";
import { useControlBarContext } from "../hooks/useControlBarContext";

const Artboard = () => {
  const { rows, cols } = useControlBarContext();
  const initialGrid: any[][] = Array.from(Array(rows), () =>
    Array(cols).fill(null)
  );
  const [grid, setGrid] = useState<any[][]>(initialGrid);

  const [gridWidth, setGridWidth] = useState<number>(100);
  const [gridHeight, setGridHeight] = useState<number>(100);

  useEffect(() => {
    const updatedGrid: any[][] = Array.from(Array(rows), () =>
      Array(cols).fill(null)
    );
    setGrid(updatedGrid);
  }, [rows, cols]);

  useEffect(() => {
    // TODO handle resize
    const handleResize = () => {};
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="grid"
      style={{
        width: `${gridWidth}%`,
        height: `${gridHeight}%`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            id={`${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
            isEven={(rowIndex + colIndex) % 2 === 0}
          />
        ))
      )}
    </div>
  );
};

export default Artboard;
