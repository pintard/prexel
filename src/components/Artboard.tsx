import { MouseEventHandler, useEffect, useState } from "react";
import GridCell from "./GridCell";
import { useControlBarContext } from "../hooks/useControlBarContext";

const Artboard = () => {
  const { rows, cols, cellColors, setCellColors, color, activeControl } =
    useControlBarContext();
  const initialGrid: any[][] = Array.from(Array(rows), () =>
    Array(cols).fill(null)
  );
  const [grid, setGrid] = useState<any[][]>(initialGrid);
  const [isDragActivated, setIsDragActivated] = useState<boolean>(false);

  useEffect(() => {
    const updatedGrid: any[][] = Array.from(Array(rows), () =>
      Array(cols).fill(null)
    );
    setGrid(updatedGrid);
  }, [rows, cols]);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragActivated]);

  const handleMouseUp = () => {
    setIsDragActivated(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsDragActivated(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragActivated) {
      const cellWidth: number = e.currentTarget.clientWidth / cols;
      const cellHeight: number = e.currentTarget.clientHeight / rows;
      const row: number = Math.floor(e.nativeEvent.offsetY / cellHeight);
      const col: number = Math.floor(e.nativeEvent.offsetX / cellWidth);

      const id: string = `${row}-${col}`;
      console.log("Curr ID", id);

      if (activeControl === "PaintControl") {
        setCellColors((prevCellColors) => ({
          ...prevCellColors,
          [id]: color,
        }));
      }

      if (activeControl === "EraseControl") {
        setCellColors((prevCellColors) => ({
          ...prevCellColors,
          [id]: undefined,
        }));
      }
    }
  };

  const handleCellClick = (id: string) => {
    const [row, col] = id.split("-");
    const oldColor: string | undefined = cellColors[id];
    if (oldColor !== color) {
      floodFill(+row, +col, oldColor, new Set());
    }
  };

  const floodFill = (
    row: number,
    col: number,
    oldColor: string | undefined,
    visited: Set<string>
  ) => {
    const id: string = `${row}-${col}`;

    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      cellColors[id] !== oldColor ||
      visited.has(id)
    ) {
      return;
    }

    visited.add(id);

    setCellColors((prevCellColors) => ({
      ...prevCellColors,
      [id]: color,
    }));

    floodFill(row - 1, col, oldColor, visited);
    floodFill(row + 1, col, oldColor, visited);
    floodFill(row, col - 1, oldColor, visited);
    floodFill(row, col + 1, oldColor, visited);
  };

  return (
    <div
      className="grid w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      onMouseDown={handleMouseDown}
      // onMouseMove={handleMouseMove}
    >
      {grid.map((row, rowIndex) =>
        row.map((_, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            id={`${rowIndex}-${colIndex}`}
            isEven={(rowIndex + colIndex) % 2 === 0}
            onClick={handleCellClick}
          />
        ))
      )}
    </div>
  );
};

export default Artboard;
