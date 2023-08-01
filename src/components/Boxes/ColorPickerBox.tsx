import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import Swatch from "../Swatch";
import DragHandle from "../DragHandle";
import { HorizontalGripIcon } from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { PagePosition } from "../../utils/constants";
import { useColorPickerBoxContext } from "../../hooks/useColorPickerBoxContext";

interface ColorPickerProps {
  isActive: boolean;
  setIsFocused: Dispatch<SetStateAction<boolean>>;
}

const ColorPickerBox = ({ isActive, setIsFocused }: ColorPickerProps) => {
  const { color, setColor, swatchHotKeys } = useControlBarContext();
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [colorPickerPosition, setColorPickerPoistion] = useState<PagePosition>({
    left: 20,
    top: 20,
  });
  const colorPickerRef = useRef<HTMLSpanElement>(null);

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

  const handleSwatchClick = (currentSwatch: string) => {
    if (activeSwatch === currentSwatch) {
      setActiveSwatch(null);
    } else {
      setActiveSwatch(currentSwatch);
    }
  };

  const handleMouseMove = (offsetX: number, offsetY: number) => {
    const pageWidth: number = document.documentElement.clientWidth;
    const pageHeight: number = document.documentElement.clientHeight;
    const maxLeft: number = pageWidth - colorPickerRef.current!.clientWidth;
    const maxTop: number = pageHeight - colorPickerRef.current!.clientHeight;

    setColorPickerPoistion((prevPosition: PagePosition) => ({
      left: Math.max(0, Math.min(prevPosition.left + offsetX, maxLeft)),
      top: Math.max(0, Math.min(prevPosition.top + offsetY, maxTop)),
    }));
  };

  if (isActive) {
    return (
      <span
        className="absolute z-20 w-64 bg-white rounded-lg shadow-cover flex flex-col items-center overflow-hidden"
        ref={colorPickerRef}
        style={{
          left: colorPickerPosition.left,
          top: colorPickerPosition.top,
        }}
      >
        <div className="bg-slate-50 w-full flex justify-center">
          <DragHandle
            icon={HorizontalGripIcon}
            width={30}
            height={24}
            onDrag={handleMouseMove}
            useDragContext={useColorPickerBoxContext}
            className="cursor-grab"
          />
        </div>

        <div className="w-full flex flex-col p-4 gap-4 items-center">
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
        </div>
      </span>
    );
  }

  return null;
};

export default ColorPickerBox;
