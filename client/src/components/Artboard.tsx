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

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    row: number;
    col: number;
    x: number;
    y: number;
  }>({ visible: false, row: 0, col: 0, x: 0, y: 0 });

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

  const handleMouseEnter = (row: number, col: number, x: number, y: number) => {
    setTooltip({ visible: true, row, col, x: x + 10, y: y - 30 });
  };

  const handleMouseLeave = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div
      id="artboard"
      className="grid w-full h-full relative"
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
              row={rowIndex}
              col={colIndex}
              isEven={(rowIndex + colIndex) % 2 === 0}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handlePaintFill}
            />
          );
        })
      )}

      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none px-2 py-1 rounded-xl text-xs bg-black text-white opacity-75"
          style={{
            top: `${tooltip.y}px`,
            left: `${tooltip.x}px`,
          }}
        >
          [{tooltip.row}, {tooltip.col}]
        </div>
      )}
    </div>
  );
};

export default Artboard;
