import { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface GridCellProps {
  isEven: boolean;
  id: string;
  onClick: (id: string) => void;
}

const GridCell = ({ isEven, id, onClick }: GridCellProps) => {
  const { cellColors, color, activeControl, updateColors, isDragging } =
    useControlBarContext();

  const [isHover, setIsHover] = useState<boolean>(false);
  const [cellColor, setCellColor] = useState<string | undefined>(
    cellColors[id] || undefined
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

  return (
    <span
      id={id}
      className={`relative z-10 select-none" ${isEven && "bg-default-gray"}`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full cursor-cell select-none active:!opacity-90"
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        style={{
          backgroundColor: cellColor,
          opacity: 1,
          ...(isHover &&
            !isDragging && { backgroundColor: color, opacity: 0.8 }),
        }}
      ></span>
    </span>
  );
};

export default GridCell;
