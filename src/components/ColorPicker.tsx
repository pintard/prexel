import { HexColorPicker, HexColorInput } from "react-colorful";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { isColorLight } from "../utils/colorUtils";

interface ColorPickerProps {
  isActive: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const ColorPicker = ({ isActive, setIsFocused }: ColorPickerProps) => {
  const { color, setColor, swatchHotKeys } = useControlBarContext();
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const colorPickerRef = useRef<HTMLSpanElement>(null);

  const handleSwatchClick = (currentSwatch: string) => {
    if (activeSwatch === currentSwatch) {
      setActiveSwatch(null);
    } else {
      setActiveSwatch(currentSwatch);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(event.target as Node)
      ) {
        setActiveSwatch(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isActive) {
    return (
      <span
        className="w-64 bg-white rounded-lg shadow-cover flex flex-col p-4 gap-4 items-center"
        ref={colorPickerRef}
      >
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput
          color={color}
          onChange={setColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          prefixed={true}
          className="border-solid border-2 rounded-md p-2 w-full outline-2 focus:outline-blue-400"
        />

        <div className="w-full grid grid-rows-2 grid-cols-4 gap-4">
          {swatchHotKeys.map((swatchHotKeyId) => {
            return (
              <Swatch
                key={swatchHotKeyId}
                id={swatchHotKeyId}
                isActive={activeSwatch === swatchHotKeyId}
                onClick={handleSwatchClick}
              />
            );
          })}
        </div>
      </span>
    );
  }

  return null;
};

interface SwatchProps {
  onClick: (currentSwatch: string) => void;
  id: string;
  isActive: boolean;
}

const Swatch = ({ onClick, id, isActive }: SwatchProps) => {
  const { color, setColor, swatchColors, setSwatchColors } =
    useControlBarContext();

  const [swatchColor, setSwatchColor] = useState<string | undefined>(
    swatchColors[id] || undefined
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
    // TODO need to throttle color change rate
  }, [color, isActive, id, setSwatchColors]);

  const textColor = swatchColor
    ? isColorLight(swatchColor)
      ? "text-black"
      : "text-white"
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
          {id}
        </span>
      </span>
    </span>
  );
};

export default ColorPicker;
