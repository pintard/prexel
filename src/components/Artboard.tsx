import React, { useEffect, useState } from "react";
import GridCell from "./GridCell";
import { useControlBarContext } from "../hooks/useControlBarContext";

type Grid = (JSX.Element | null)[][];

const Artboard = () => {
  const {
    rows,
    cols,
    cellColors,
    setCellColors,
    updateColors,
    color,
    activeControl,
    updateHistory,
    isStrokeActive,
    setIsStrokeActive,
  } = useControlBarContext();

  const emptyGrid: Grid = Array.from(Array(rows), () => Array(cols).fill(null));

  const [grid, setGrid] = useState<Grid>(emptyGrid);

  useEffect(() => {
    setGrid(emptyGrid);
  }, [rows, cols]);

  useEffect(() => {
    document.addEventListener("mouseup", handleStrokeEnd);
    document.addEventListener("touchend", handleStrokeEnd);

    return () => {
      document.removeEventListener("mouseup", handleStrokeEnd);
      document.removeEventListener("touchend", handleStrokeEnd);
    };
  }, [isStrokeActive]);

  const handleMouseDown = () => {
    setIsStrokeActive(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsStrokeActive(true);
    handleTouchMove(e);
    // TODO diffrentiate from click, double trigger
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isStrokeActive) {
      const rect: DOMRect = e.currentTarget.getBoundingClientRect();
      const offsetX: number = e.clientX - rect.left;
      const offsetY: number = e.clientY - rect.top;

      const cellWidth: number = rect.width / cols;
      const cellHeight: number = rect.height / rows;

      const col: number = Math.floor(offsetX / cellWidth);
      const row: number = Math.floor(offsetY / cellHeight);

      const id: string = `${row}-${col}`;
      handleStroke(id);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // if (isStrokeActive) {
    //   const cellWidth: number = e.currentTarget.clientWidth / cols;
    //   const cellHeight: number = e.currentTarget.clientHeight / rows;

    //   const touch: React.Touch = e.touches[0];
    //   const row: number = Math.floor(touch.pageY / cellHeight);
    //   const col: number = Math.floor(touch.pageX / cellWidth);

    //   const id: string = `${row}-${col}`;
    //   handleStroke(id);
    // }
    if (isStrokeActive) {
      const touch: React.Touch = e.touches[0];
      const rect: DOMRect = e.currentTarget.getBoundingClientRect();
      const offsetX: number = touch.clientX - rect.left;
      const offsetY: number = touch.clientY - rect.top;

      const cellWidth: number = rect.width / cols;
      const cellHeight: number = rect.height / rows;

      const col: number = Math.floor(offsetX / cellWidth);
      const row: number = Math.floor(offsetY / cellHeight);

      const id: string = `${row}-${col}`;
      handleStroke(id);
    }
  };

  const handleStroke = (id: string) => {
    if (activeControl === "PaintControl") {
      setCellColors((prevColors) => ({
        ...prevColors,
        [id]: color,
      }));
    }

    if (activeControl === "EraseControl") {
      setCellColors((prevColors) => ({
        ...prevColors,
        [id]: undefined,
      }));
    }
  };

  const handleStrokeEnd = () => {
    setIsStrokeActive(false);
    updateHistory(cellColors);
  };

  const handlePaintFill = (id: string) => {
    const [row, col]: string[] = id.split("-");
    const oldColor: string | undefined = cellColors[id];
    if (oldColor !== color) {
      paintFill(+row, +col, oldColor, new Set());
      // paintFillQueue(+row, +col, oldColor);
    }
  };

  const paintFillQueue = (
    startRow: number,
    startCol: number,
    oldColor: string | undefined
  ) => {
    // If the old color matches the new one, there's no need to fill
    if (oldColor === color || !oldColor) return;

    const queue: [number, number][] = [[startRow, startCol]];
    const visited: Set<string> = new Set();

    // Helper function to check boundaries and color
    const isValid = (row: number, col: number): boolean => {
      const id = `${row}-${col}`;
      return (
        row >= 0 &&
        row < rows &&
        col >= 0 &&
        col < cols &&
        cellColors[id] === oldColor &&
        !visited.has(id)
      );
    };

    // Iterate through the queue until it is empty
    while (queue.length > 0) {
      const [row, col] = queue.shift()!;
      const id: string = `${row}-${col}`;

      if (!isValid(row, col)) continue;

      // Mark the cell as visited and update its color
      visited.add(id);
      updateColors(id, color); // Update the cell color

      // Add the neighboring cells to the queue for processing
      if (isValid(row - 1, col)) queue.push([row - 1, col]); // Top
      if (isValid(row + 1, col)) queue.push([row + 1, col]); // Bottom
      if (isValid(row, col - 1)) queue.push([row, col - 1]); // Left
      if (isValid(row, col + 1)) queue.push([row, col + 1]); // Right
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

    updateColors(id, color);

    paintFill(row - 1, col, oldColor, visited);
    paintFill(row + 1, col, oldColor, visited);
    paintFill(row, col - 1, oldColor, visited);
    paintFill(row, col + 1, oldColor, visited);
  };

  return (
    <div
      id="artboard"
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
        row.map((_, colIndex) => {
          const cellId: string = `${rowIndex}-${colIndex}`;
          return (
            <GridCell
              key={cellId}
              id={cellId}
              isEven={(rowIndex + colIndex) % 2 === 0}
              onClick={handlePaintFill}
            />
          );
        })
      )}
    </div>
  );
};

export default Artboard;
