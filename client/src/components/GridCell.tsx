import { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface GridCellProps {
  isEven: boolean;
  id: string;
  row: number;
  col: number;
  onClick: (id: string) => void;
  onMouseEnter: (row: number, col: number, x: number, y: number) => void;
  onMouseLeave: () => void;
}

const GridCell = ({
  isEven,
  id,
  row,
  col,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: GridCellProps) => {
  const { cellColors, color, activeControl, updateColors, isDragging } =
    useControlBarContext();

  const [isHover, setIsHover] = useState<boolean>(false);
  const [cellColor, setCellColor] = useState<string | undefined>(
    cellColors[id]
  );

  useEffect(() => {
    setCellColor(cellColors[id]);
  }, [cellColors]);

  const handleClick = () => {
    if (activeControl === "PaintControl") {
      setCellColor(color);
      updateColors(id, color);
    }

    if (activeControl === "EraseControl") {
      setCellColor(undefined);
      updateColors(id, undefined);
    }

    if (activeControl === "FillControl") {
      onClick(id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    onMouseEnter(row, col, e.clientX, e.clientY);
  };

  return (
    <span
      id={id}
      className={`grid-cell relative select-none z-10 ${
        isEven ? "bg-default-gray dark:bg-default-neutral" : ""
      }`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
        onMouseLeave();
      }}
    >
      <span
        className="absolute w-full h-full cursor-cell select-none active:!opacity-40"
        style={{
          backgroundColor: cellColor,
          ...(isHover &&
            !isDragging && {
              backgroundColor:
                activeControl === "FillControl" ||
                activeControl === "PaintControl"
                  ? color
                  : "#EEEEEE",
              opacity: 0.9,
            }),
        }}
      ></span>
    </span>
  );
};

export default GridCell;
