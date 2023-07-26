import { useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface GridCellProps {
  rowIndex: number;
  colIndex: number;
  isEven: boolean;
  id: string;
}

const GridCell = ({ isEven, id }: GridCellProps) => {
  const { cellColors, color, activeControl, setCellColors } =
    useControlBarContext();

  const [cellColor, setCellColor] = useState<string | undefined>(
    cellColors?.[id] || undefined
  );

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    console.log(e.currentTarget.id, {
      height: e.currentTarget.offsetHeight,
      width: e.currentTarget.offsetWidth,
    });

    if (activeControl === "PaintControl") {
      setCellColor(color);
      setCellColors((prevCellColors) => ({
        ...prevCellColors,
        [id]: color,
      }));
    }

    if (activeControl === "EraseControl") {
      setCellColor(undefined);
      setCellColors((prevCellColors) => ({
        ...prevCellColors,
        [id]: undefined,
      }));
    }
  };

  return (
    <span
      id={id}
      className={`relative cursor-cell hover:!bg-slate-200 active:!bg-slate-300 ${
        isEven ? "bg-default-gray" : ""
      }`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full"
        style={{ backgroundColor: cellColor }}
      ></span>
    </span>
  );
};

export default GridCell;
