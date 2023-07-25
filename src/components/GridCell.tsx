import { useState } from "react";

interface GridCellProps {
  rowIndex: number;
  colIndex: number;
  isEven: boolean;
}

const GridCell = ({ rowIndex, colIndex, isEven }: GridCellProps) => {
  const neutralBg: string = "#f8f8f8";
  const initialCellColor: string = isEven ? neutralBg : "";
  const [cellColor, setCellColor] = useState<string>(initialCellColor);

  const report = (e: React.MouseEvent<HTMLSpanElement>) => {
    console.log(e.currentTarget.id, {
      height: e.currentTarget.offsetHeight,
      width: e.currentTarget.offsetWidth,
    });
  };

  const updateCellColor = (color: string) => {
    setCellColor(color);
  };

  return (
    <span
      id={`${rowIndex}-${colIndex}`}
      className="cursor-cell hover:!bg-slate-200 active:!bg-slate-300"
      style={{ backgroundColor: cellColor }}
      onClick={report}
    ></span>
  );
};

export default GridCell;
