import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import {
  BrushIcon,
  EraserIcon,
  PaintBucketIcon,
  PaletteIcon,
  MenuIcon,
  UndoIcon,
  RedoIcon,
  TrashIcon,
  DropIcon,
  PencilIcon,
} from "./Icons";

import IconButton from "./IconButton";

import { ActiveControl } from "../contexts/ControlBarProvider";

const ControlBar = () => {
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
    isMenuBoxOpen,
    setIsMenuBoxOpen,
    isKeybindBoxOpen,
    setIsKeybindBoxOpen,
    isDimensionBoxOpen,
    setIsDimensionBoxOpen,
    isColorPickerBoxOpen,
    setIsColorPickerBoxOpen,
    isInputFocused,
    isAnyModalOpen,
  } = useControlBarContext();

  const [isUndoActive, setIsUndoActive] = useState(false);
  const [isRedoActive, setIsRedoActive] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isAnyModalOpen) return;
      if (isInputFocused) return;

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
        case "z":
          handleHistory(e);
          break;
        case "Escape":
          handleEscape();
          break;
        default:
          if (swatchHotKeys.includes(e.key)) {
            setColor(swatchColors[e.key] ?? color);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [
    color,
    isInputFocused,
    swatchColors,
    activeControl,
    isColorPickerBoxOpen,
    isMenuBoxOpen,
    isDimensionBoxOpen,
    isKeybindBoxOpen,
    historyIndex,
    isAnyModalOpen,
  ]);

  const handleHistory = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.shiftKey) {
        console.log("REDO EXECUTED");
        redo();
      } else {
        undo();
      }
    }
  };

  const handleEscape = () => {
    if (isDimensionBoxOpen) {
      setIsDimensionBoxOpen(false);
    } else if (isKeybindBoxOpen) {
      setIsKeybindBoxOpen(false);
    } else if (isMenuBoxOpen) {
      setIsMenuBoxOpen(false);
    } else if (isColorPickerBoxOpen) {
      setIsColorPickerBoxOpen(false);
    } else {
      setActiveControl(null);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const index: number = historyIndex - 1;
      setHistoryIndex(index);
      setCellColors(colorHistory[index]);
      setIsUndoActive(true);
      setTimeout(() => setIsUndoActive(false), 200);
    }
  };

  const redo = () => {
    if (historyIndex < colorHistory.length - 1) {
      const index: number = historyIndex + 1;
      setHistoryIndex(index);
      setCellColors(colorHistory[index]);
      setIsRedoActive(true);
      setTimeout(() => setIsRedoActive(false), 200);
    }
  };

  const toggleActiveControl = (control: ActiveControl) => {
    setActiveControl(activeControl === control ? null : control);
  };

  return (
    <div
      key="controlBar"
      className="h-full p-2 flex flex-col items-center gap-1 select-none pointer-events-auto"
    >
      <IconButton
        isActive={isMenuBoxOpen}
        icon={MenuIcon}
        onClick={() => setIsMenuBoxOpen(!isMenuBoxOpen)}
      />
      <IconButton isActive={isUndoActive} icon={UndoIcon} onClick={undo} />
      <IconButton isActive={isRedoActive} icon={RedoIcon} onClick={redo} />
      <IconButton
        option={1}
        isActive={activeControl === "PaintControl"}
        icon={PencilIcon}
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
        icon={DropIcon}
        onClick={() => setIsColorPickerBoxOpen(!isColorPickerBoxOpen)}
        color={color}
      />
    </div>
  );
};

export default ControlBar;
