import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import Swatch from "../Swatch";
import DragHandle from "../DragHandle";
import { HorizontalGripIcon } from "../Icons";
import { PagePosition } from "../../utils/constants";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { useColorPickerBoxContext } from "../../hooks/useColorPickerBoxContext";
import useLocalStorage from "../../hooks/useLocalStorage";

const ColorPickerBox = () => {
  const {
    color,
    setColor,
    swatchHotKeys,
    isColorPickerBoxOpen,
    setIsInputFocused,
  } = useControlBarContext();
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [colorPickerPosition, setColorPickerPosition] =
    useLocalStorage<PagePosition>("colorpicker-position", {
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
    if (colorPickerRef.current && colorPickerRef.current.parentElement) {
      const parentRect: DOMRect =
        colorPickerRef.current.parentElement.getBoundingClientRect();
      const maxLeft: number =
        parentRect.width - colorPickerRef.current.offsetWidth;
      const maxTop: number =
        parentRect.height - colorPickerRef.current.offsetHeight;

      setColorPickerPosition((prevPosition) => {
        const newLeft: number = Math.max(
          0,
          Math.min(prevPosition.left + offsetX, maxLeft)
        );
        const newTop: number = Math.max(
          0,
          Math.min(prevPosition.top + offsetY, maxTop)
        );
        return { left: newLeft, top: newTop };
      });
    }
  };

  if (isColorPickerBoxOpen) {
    return (
      <span
        className="absolute z-20 w-64 bg-gray-100 dark:bg-default-neutral rounded-lg shadow-dark dark:shadow-light flex flex-col items-center overflow-hidden"
        ref={colorPickerRef}
        style={{
          left: colorPickerPosition.left,
          top: colorPickerPosition.top,
        }}
      >
        <div className="bg-slate-50 dark:bg-neutral-900 w-full flex justify-center">
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
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            prefixed={true}
            className="bg-white dark:bg-default-neutral dark:text-neutral-500 border-solid border-2 dark:border-neutral-800 rounded-md p-2 w-full outline-2 focus:outline-blue-400"
          />
          <div className="w-full grid grid-rows-2 grid-cols-4 gap-4">
            {swatchHotKeys.map((swatchHotKeyId: string) => (
              <Swatch
                key={swatchHotKeyId}
                id={swatchHotKeyId}
                isActive={activeSwatch === swatchHotKeyId}
                onClick={handleSwatchClick}
              />
            ))}
          </div>
        </div>
      </span>
    );
  }

  return null;
};

export default ColorPickerBox;
