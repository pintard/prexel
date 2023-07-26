const hexToXterm256 = (hexColor: string | undefined): number | null => {
  if (!hexColor) {
    return null;
  }
  const r: number = parseInt(hexColor.slice(1, 3), 16);
  const g: number = parseInt(hexColor.slice(3, 5), 16);
  const b: number = parseInt(hexColor.slice(5, 7), 16);

  let minDistance: number = Number.MAX_SAFE_INTEGER;
  let xtermColor: number = 0;

  for (let i = 0; i < 256; i++) {
    const xtermR: number = (i >> 5) * 40;
    const xtermG: number = ((i >> 2) & 0x07) * 40;
    const xtermB: number = (i & 0x03) * 85;

    const distance: number = Math.sqrt(
      (r - xtermR) ** 2 + (g - xtermG) ** 2 + (b - xtermB) ** 2
    );

    if (distance < minDistance) {
      minDistance = distance;
      xtermColor = i;
    }
  }

  return xtermColor;
};

const generateCuteFormat = (
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
  const rawCuteCode: string = generateCuteFormat(cellColors, rows, cols);
  return btoa(rawCuteCode);
};
