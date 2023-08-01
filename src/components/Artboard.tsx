import { useEffect, useState } from "react";
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
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragActivated]);

  const handleMouseDown = () => {
    setIsDragActivated(true);
  };

  const handleMouseUp = () => {
    setIsDragActivated(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragActivated) {
      const { clientX, clientY, currentTarget } = e.nativeEvent;
      if (!(currentTarget instanceof HTMLDivElement)) return;

      const rect: DOMRect = currentTarget.getBoundingClientRect();
      const cellWidth: number = rect.width / cols;
      const cellHeight: number = rect.height / rows;
      const row: number = Math.floor((clientY - rect.top) / cellHeight);
      const col: number = Math.floor((clientX - rect.left) / cellWidth);
      const id: string = `${row}-${col}`;
      handleStroke(id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragActivated(true);
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsDragActivated(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragActivated) {
      const cellWidth: number = e.currentTarget.clientWidth / cols;
      const cellHeight: number = e.currentTarget.clientHeight / rows;
      const touch = e.touches[0];
      const row: number = Math.floor(touch.pageY / cellHeight);
      const col: number = Math.floor(touch.pageX / cellWidth);
      const id: string = `${row}-${col}`;
      handleStroke(id);
    }
  };

  const handleStroke = (id: string) => {
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
  };

  const handleCellClick = (id: string) => {
    const [row, col] = id.split("-");
    const oldColor: string | undefined = cellColors[id];
    if (oldColor !== color) {
      paintFill(+row, +col, oldColor, new Set());
    }
  };

  const paintFill = (
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

    paintFill(row - 1, col, oldColor, visited);
    paintFill(row + 1, col, oldColor, visited);
    paintFill(row, col - 1, oldColor, visited);
    paintFill(row, col + 1, oldColor, visited);
  };

  return (
    <div
      className="grid w-full h-full"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
