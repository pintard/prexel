import { useEffect, useState } from "react";
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

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isStrokeActive) {
      const cellWidth: number = e.currentTarget.clientWidth / cols;
      const cellHeight: number = e.currentTarget.clientHeight / rows;

      const touch: React.Touch = e.touches[0];
      const row: number = Math.floor(touch.pageY / cellHeight);
      const col: number = Math.floor(touch.pageX / cellWidth);

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
