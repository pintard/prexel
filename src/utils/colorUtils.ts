export const rgbToHex = (red: number, green: number, blue: number): string => {
  const validRed = Math.max(0, Math.min(255, red));
  const validGreen = Math.max(0, Math.min(255, green));
  const validBlue = Math.max(0, Math.min(255, blue));

  const redHex = validRed.toString(16).padStart(2, "0");
  const greenHex = validGreen.toString(16).padStart(2, "0");
  const blueHex = validBlue.toString(16).padStart(2, "0");

  return `#${redHex}${greenHex}${blueHex}`;
};

export const hexToRgb = (hexColor: string | undefined): number[] | null => {
  if (!hexColor || !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexColor)) {
    return null;
  }

  const hex = hexColor.replace("#", "");
  const isShortHex = hex.length === 3;

  const redHex = isShortHex ? hex[0] + hex[0] : hex.substring(0, 2);
  const greenHex = isShortHex ? hex[1] + hex[1] : hex.substring(2, 4);
  const blueHex = isShortHex ? hex[2] + hex[2] : hex.substring(4, 6);

  const r = parseInt(redHex, 16);
  const g = parseInt(greenHex, 16);
  const b = parseInt(blueHex, 16);
  return [r, g, b];
};

export const isColorLight = (hexColor: string): boolean => {
  const r: number = parseInt(hexColor.slice(1, 3), 16);
  const g: number = parseInt(hexColor.slice(3, 5), 16);
  const b: number = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125;
};
