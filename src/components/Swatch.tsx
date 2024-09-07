import { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { isColorLight } from "../utils/colorUtils";

interface SwatchProps {
  onClick: (currentSwatch: string) => void;
  id: string;
  isActive: boolean;
}

const Swatch = ({ onClick, id, isActive }: SwatchProps) => {
  const { color, setColor, swatchColors, setSwatchColors } =
    useControlBarContext();

  const [swatchColor, setSwatchColor] = useState<string | undefined>(
    swatchColors[id]
  );

  useEffect(() => {
    setSwatchColor(swatchColors[id]);
  }, [swatchColors, id]);

  useEffect(() => {
    if (isActive && color !== swatchColors[id]) {
      setSwatchColor(color);
      setSwatchColors((prevSwatchColors) => ({
        ...prevSwatchColors,
        [id]: color,
      }));
    }
  }, [color, isActive, id, setSwatchColors, swatchColors]);

  const handleClick = () => {
    if (!swatchColor) {
      setSwatchColor(color);
    } else {
      setColor(swatchColor);
    }
    onClick(id);
  };

  const getSwatchTextColor = (swatchColor: string): string =>
    isColorLight(swatchColor) ? "text-black" : "text-white";

  const textColor = swatchColor
    ? getSwatchTextColor(swatchColor)
    : "text-zinc-400";

  return (
    <span
      className={`relative w-10 h-10 rounded-xl bg-default-gray dark:bg-neutral-800 overflow-hidden select-none cursor-pointer dark:border-neutral-700 border-solid border-2 ${
        isActive ? "border-blue-300" : ""
      }`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full"
        style={{ backgroundColor: swatchColor }}
      >
        <span className={`absolute top-1 left-2 ${textColor} text-xs`}>
          {id.toUpperCase()}
        </span>
      </span>
    </span>
  );
};

export default Swatch;
