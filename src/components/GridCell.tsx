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

  return (
    <span
      id={id}
      className={`relative z-10 select-none ${isEven && "bg-default-gray dark:bg-default-neutral"}`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full cursor-cell select-none active:!opacity-40"
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        style={{
          backgroundColor: cellColor,
          ...(isHover &&
            !isDragging && {
              backgroundColor:
                (activeControl === "FillControl" ||
                activeControl === "PaintControl")
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
