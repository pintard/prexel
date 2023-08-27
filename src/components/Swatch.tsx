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

  const handleClick = () => {
    if (!swatchColor) {
      setSwatchColor(color);
    } else {
      setColor(swatchColor);
    }
    onClick(id);
  };

  useEffect(() => {
    if (isActive) {
      setSwatchColor(color);
      setSwatchColors((prevSwatchColors) => ({
        ...prevSwatchColors,
        [id]: color,
      }));
    }
  }, [color, isActive, id, setSwatchColors]);

  const getSwatchTextColor = (swatchColor: string): string =>
    isColorLight(swatchColor) ? "text-black" : "text-white";

  const textColor = swatchColor
    ? getSwatchTextColor(swatchColor)
    : "text-zinc-400";

  return (
    <span
      className={`relative w-10 h-10 rounded bg-default-gray overflow-hidden select-none cursor-pointer border-solid border-2 ${
        isActive ? "border-blue-400" : ""
      }`}
      onClick={handleClick}
    >
      <span
        className="absolute w-full h-full"
        style={{ backgroundColor: swatchColor }}
      >
        <span className={`absolute bottom-1 right-2 ${textColor} text-xxs`}>
          {id.toUpperCase()}
        </span>
      </span>
    </span>
  );
};

export default Swatch;
