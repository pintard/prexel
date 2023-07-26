import { hexToXterm256 } from "./colorUtils";

const generateCuteData = (
  cellColors: {
    [key: string]: string | undefined;
  },
  rows: number,
  cols: number
): string => {
  let cuteData: string = "";

  const getPrexel = (xtermValue: number): string => {
    return `\x1b[48;5;${xtermValue}m \x1b[0m`;
  };

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const coordKey: string = `${i}-${j}`;
      const xtermValue: number | null = hexToXterm256(cellColors[coordKey]);
      cuteData += xtermValue ? getPrexel(xtermValue) : " ";
    }
    cuteData += "\n";
  }

  return cuteData;
};

export const getCuteCode = (
  cellColors: {
    [key: string]: string | undefined;
  },
  rows: number,
  cols: number
): string => {
  const rawCuteCode: string = generateCuteData(cellColors, rows, cols);
  return btoa(rawCuteCode);
};
