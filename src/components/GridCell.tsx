import { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface GridCellProps {
  isEven: boolean;
  id: string;
  onClick: (id: string) => void;
}

const GridCell = ({ isEven, id, onClick }: GridCellProps) => {
  const { cellColors, color, activeControl, setCellColors } =
    useControlBarContext();

  const [hover, setHover] = useState<boolean>(false);
  const [cellColor, setCellColor] = useState<string | undefined>(
    cellColors[id] || undefined
  );

  useEffect(() => {
    setCellColor(cellColors[id]);
  }, [cellColors]);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
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

    if (activeControl === "FillControl") {
      onClick(id);
    }
  };

  return (
    <span
      id={id}
      className={`relative cursor-cell hover:!bg-red-100 active:!bg-red-200 ${
        isEven ? "bg-default-gray" : ""
      }`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full active:!bg-opacity-50"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        style={{
          backgroundColor: cellColor,
          opacity: 1,
          ...(hover ? { opacity: 0.8 } : null),
        }}
      ></span>
    </span>
  );
};

export default GridCell;
