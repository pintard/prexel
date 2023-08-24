import { hexToRgb, rgbToHex } from "./colorUtils";
import { StringHash } from "./constants";

const getBlockFromRgb = (rgb: number[]): string => {
  const [r, g, b] = rgb;
  return `\x1b[48;2;${r};${g};${b}m \x1b[0m`;
};

const getRgbFromBlock = (block: string): number[] => {
  const match: RegExpMatchArray | null = block.match(
    /\x1b\[48;2;(\d+);(\d+);(\d+)m \x1b\[0m/
  );

  if (match) {
    const [, r, g, b] = match.map(Number);

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
      return [r, g, b];
    }
  }
  return [];
};

export const getCuteCode = (
  cellColors: StringHash,
  rows: number,
  cols: number
): string => {
  let rawCuteCode: string = "";
  const emptyBlock: string = "\x1b[0m \x1b[0m";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const coordKey: string = `${i}-${j}`;
      const rgb: number[] | null = hexToRgb(cellColors[coordKey]);
      rawCuteCode += rgb ? getBlockFromRgb(rgb) : emptyBlock;
    }

    if (i < rows - 1) {
      rawCuteCode += "\n";
    }
  }

  return btoa(rawCuteCode);
};

export const getPrexel = (cuteCode: string): StringHash => {
  const prexel: StringHash = {};
  const rawCuteCode: string = atob(cuteCode);
  const rows: string[] = rawCuteCode.split("\n");

  for (let i = 0; i < rows.length; i++) {
    const cols: string[] =
      rows[i].match(/[\x1B\u001b]\[.*?m [\x1B\u001b]\[0m/gi) || [];

    for (let j = 0; j < cols.length; j++) {
      const rgb: number[] = getRgbFromBlock(cols[j]);
      const hexColor: string | undefined =
        rgb.length === 3 ? rgbToHex(rgb[0], rgb[1], rgb[2]) : undefined;
      const coordKey: string = `${i}-${j}`;
      prexel[coordKey] = hexColor;
    }
  }

  return prexel;
};
