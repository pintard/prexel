import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import {
  BrushIcon,
  EraserIcon,
  PaintBucketIcon,
  PaletteIcon,
  MenuIcon,
  VerticalGripIcon,
  UndoIcon,
  RedoIcon,
} from "./Icons";
import DimensionBox from "./Boxes/DimensionBox";
import ColorPickerBox from "./Boxes/ColorPickerBox";
import MenuBox from "./Boxes/MenuBox";

import IconButton from "./IconButton";
import DragHandle from "./DragHandle";

import { ActiveControl } from "../contexts/ControlBarProvider";
import { PagePosition } from "../utils/constants";
import { VerticalDivider } from "./Divider";

const ControlBar = () => {
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isMenuBoxOpen, setIsMenuBoxOpen] = useState<boolean>(false);
  const [isDimensionBoxOpen, setIsDimensionBoxOpen] = useState<boolean>(false);
  const [isColorPickerBoxOpen, setIsColorPickerBoxOpen] =
    useState<boolean>(false);
  const [isBoxAreaOpen, setIsBoxAreaOpen] = useState<boolean>(false);
  const [isBelowMidScreen, setIsBelowMidScreen] = useState<boolean>(false);
  const [controlBarPosition, setControlBarPosition] = useState<PagePosition>({
    left: 0,
    top: 0,
  });

  const controlBarAreaRef = useRef<HTMLDivElement>(null);

  const {
    activeControl,
    setActiveControl,
    color,
    setColor,
    swatchColors,
    swatchHotKeys,
    historyIndex,
    setHistoryIndex,
    colorHistory,
    setCellColors,
  } = useControlBarContext();

  useLayoutEffect(() => {
    if (controlBarAreaRef.current) {
      const controlBarWidth: number = controlBarAreaRef.current.offsetWidth;
      setControlBarPosition({
        left: (window.innerWidth - controlBarWidth) / 2,
        top: 40,
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isInputFocused) return;

      if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          console.log("click redo");
          redo();
        } else {
          console.log("click undo");
          undo();
        }
      }

      switch (e.key) {
        case "1":
          toggleActiveControl("PaintControl");
          break;
        case "2":
          toggleActiveControl("EraseControl");
          break;
        case "3":
          toggleActiveControl("FillControl");
          break;
        case "4":
          setIsColorPickerBoxOpen(!isColorPickerBoxOpen);
          break;
        case "/":
          setIsMenuBoxOpen(!isMenuBoxOpen);
          break;
        case "Escape":
          if (isDimensionBoxOpen) {
            setIsDimensionBoxOpen(false);
          } else if (isMenuBoxOpen) {
            setIsMenuBoxOpen(false);
          } else if (isColorPickerBoxOpen) {
            setIsColorPickerBoxOpen(false);
          } else {
            setActiveControl(null);
          }
          break;
        default:
          if (swatchHotKeys.includes(e.key)) {
            setColor(swatchColors[e.key] ?? color);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    color,
    isInputFocused,
    swatchColors,
    activeControl,
    isColorPickerBoxOpen,
    isMenuBoxOpen,
    isDimensionBoxOpen,
  ]);

  useEffect(() => {
    setIsBoxAreaOpen(isMenuBoxOpen || isDimensionBoxOpen);
  }, [isMenuBoxOpen, isDimensionBoxOpen]);

  const undo = () => {
    if (historyIndex > 0) {
      const newHistoryIndex: number = historyIndex - 1;
      setHistoryIndex(newHistoryIndex);
      setCellColors(colorHistory[newHistoryIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < colorHistory.length - 1) {
      const newHistoryIndex: number = historyIndex + 1;
      setHistoryIndex(newHistoryIndex);
      setCellColors(colorHistory[newHistoryIndex]);
    }
  };

  const toggleActiveControl = (control: ActiveControl) => {
    setActiveControl(activeControl === control ? null : control);
  };

  const handleMouseMove = (offsetX: number, offsetY: number) => {
    const pageWidth: number = document.documentElement.clientWidth;
    const pageHeight: number = document.documentElement.clientHeight;
    const maxLeft: number = pageWidth - controlBarAreaRef.current!.clientWidth;
    const maxTop: number = pageHeight - controlBarAreaRef.current!.clientHeight;

    setControlBarPosition((prevPos: PagePosition) => {
      const newLeft: number = Math.max(
        0,
        Math.min(prevPos.left + offsetX, maxLeft)
      );
      const newTop: number = Math.max(
        0,
        Math.min(prevPos.top + offsetY, maxTop)
      );

      setIsBelowMidScreen(newTop > pageHeight / 2);
      return { left: newLeft, top: newTop };
    });
  };

  const controlBar: React.JSX.Element = (
    <span
      key="controlBar"
      className="z-30 p-1 h-12 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1 select-none"
    >
      <DragHandle
        icon={VerticalGripIcon}
        width={14}
        height={22}
        onDrag={handleMouseMove}
        useDragContext={useControlBarContext}
        className="p-2.5 px-0 cursor-grab"
      />
      <IconButton icon={UndoIcon} onClick={undo} />
      <IconButton icon={RedoIcon} onClick={redo} />
      <VerticalDivider />
      <IconButton
        option={1}
        isActive={activeControl === "PaintControl"}
        icon={BrushIcon}
        onClick={() => toggleActiveControl("PaintControl")}
      />
      <IconButton
        option={2}
        isActive={activeControl === "EraseControl"}
        icon={EraserIcon}
        onClick={() => toggleActiveControl("EraseControl")}
      />
      <IconButton
        option={3}
        isActive={activeControl === "FillControl"}
        icon={PaintBucketIcon}
        onClick={() => toggleActiveControl("FillControl")}
      />
      <IconButton
        option={4}
        isActive={isColorPickerBoxOpen}
        icon={PaletteIcon}
        onClick={() => setIsColorPickerBoxOpen(!isColorPickerBoxOpen)}
      />
      <VerticalDivider />
      <IconButton
        isActive={isMenuBoxOpen}
        icon={MenuIcon}
        onClick={() => setIsMenuBoxOpen(!isMenuBoxOpen)}
      />
    </span>
  );

  const menuBox: React.JSX.Element = (
    <MenuBox
      key="menuBox"
      isActive={isMenuBoxOpen}
      closeMenuBox={() => setIsMenuBoxOpen(false)}
      isDimensionBoxOpen={isDimensionBoxOpen}
      setIsDimensionBoxOpen={setIsDimensionBoxOpen}
    />
  );

  const dimensionBox: React.JSX.Element = (
    <DimensionBox
      key="dimensionBox"
      isActive={isDimensionBoxOpen}
      setIsInputFocused={setIsInputFocused}
    />
  );

  const boxArea: React.JSX.Element = (
    <div
      key="boxArea"
      className={`z-30 w-full ${
        isBelowMidScreen ? "mb-4" : "mt-4"
      } flex flex-col gap-4 items-center ${!isBoxAreaOpen && "hidden"}`}
    >
      {isBelowMidScreen ? [dimensionBox, menuBox] : [menuBox, dimensionBox]}
    </div>
  );

  return (
    <>
      <div
        ref={controlBarAreaRef}
        className="absolute flex flex-col items-center"
        style={{
          left: controlBarPosition.left,
          top: controlBarPosition.top,
        }}
      >
        {[controlBar, boxArea]}
      </div>
      <ColorPickerBox
        isActive={isColorPickerBoxOpen}
        setIsInputFocused={setIsInputFocused}
      />
    </>
  );
};

export default ControlBar;
