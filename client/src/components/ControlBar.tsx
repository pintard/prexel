import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import {
  EraserIcon,
  PaintBucketIcon,
  MenuIcon,
  UndoIcon,
  RedoIcon,
  DropIcon,
  PencilIcon,
} from "./Icons";
import IconButton from "./IconButton";
import { ActiveControl } from "../contexts/ControlBarProvider";
import { useKeybindContext } from "../hooks/useKeybindContext";

const ControlBar = () => {
  const {
    activeControl,
    setActiveControl,
    color,
    setColor,
    swatchColors,
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

  const { onKeybindTriggered, triggeredAction } = useKeybindContext();
  const [isUndoActive, setIsUndoActive] = useState<boolean>(false);
  const [isRedoActive, setIsRedoActive] = useState<boolean>(false);

  const shouldIgnoreKeybinds = (): boolean => isAnyModalOpen || isInputFocused;

  useEffect(() => {
    if (shouldIgnoreKeybinds()) return;
    onKeybindTriggered((action: string) => {
      handleCustomKeybindAction(action);
    });
  }, [
    color,
    isInputFocused,
    activeControl,
    historyIndex,
    isAnyModalOpen,
    triggeredAction,
  ]);

  const handleCustomKeybindAction = (action: string) => {
    switch (action) {
      case "paint":
        toggleActiveControl("PaintControl");
        break;
      case "erase":
        toggleActiveControl("EraseControl");
        break;
      case "fill":
        toggleActiveControl("FillControl");
        break;
      case "picker":
        setIsColorPickerBoxOpen(!isColorPickerBoxOpen);
        break;
      case "menu":
        setIsMenuBoxOpen(!isMenuBoxOpen);
        break;
      case "undo":
        undo();
        break;
      case "redo":
        redo();
        break;
      case "escape":
        handleEscape();
        break;
      default:
        if (action.startsWith("swatch")) {
          const key: string = action.charAt(action.length - 1).toLowerCase();
          setColor(swatchColors[key] ?? color);
        }
        break;
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
