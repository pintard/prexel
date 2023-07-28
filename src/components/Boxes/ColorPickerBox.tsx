import { HexColorPicker, HexColorInput } from "react-colorful";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import Swatch from "../Swatch";

interface ColorPickerProps {
  isActive: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const ColorPickerBox = ({ isActive, setIsFocused }: ColorPickerProps) => {
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
        className="z-20 w-64 bg-white rounded-lg shadow-cover flex flex-col p-4 gap-4 items-center"
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

export default ColorPickerBox;
