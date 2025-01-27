import React, { useEffect } from "react";
import {
  UploadIcon,
  GridIcon,
  MoonIcon,
  SunIcon,
  ResetIcon,
  MinimizeIcon,
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { useTheme } from "../../hooks/useTheme";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import MenuItem from "./MenuItem";
import KeybindBox from "./KeybindBox";

const MenuBox = () => {
  const {
    setIsUploadModalOpen,
    setSwatchColors,
    isMenuBoxOpen,
    isDimensionBoxOpen,
    setIsDimensionBoxOpen,
    isKeybindBoxOpen,
    setIsKeybindBoxOpen,
  } = useControlBarContext();
  const { theme, toggleTheme } = useTheme();
  const { resetKeybinds, onKeybindTriggered, triggeredAction } =
    useKeybindContext();

  useEffect(() => {
    onKeybindTriggered((action: string) => {
      handleCustomKeybindAction(action);
    });
  }, [triggeredAction]);

  const handleCustomKeybindAction = (action: string) => {
    switch (action) {
      case "darkLightToggle":
        toggleTheme();
        break;
      case "reset":
        handleReset();
        break;
      default:
        break;
    }
  };

  const handleReset = () => {
    setSwatchColors({});
    resetKeybinds();
    // TODO color picker box location
    alert("Swatch palette and keybinds have been reset.");
  };

  const handleResize = () => {
    setIsDimensionBoxOpen(!isDimensionBoxOpen);
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  if (isMenuBoxOpen) {
    return (
      <div className="absolute top-4 left-4 z-30 flex flex-row items-start gap-4">
        <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl shadow-dark overflow-hidden p-2 border border-gray-300 dark:border-neutral-600">
          <ul className="w-full flex flex-col gap-1 items-center">
            <MenuItem
              label="keybinds"
              value="keybinds"
              icon={GridIcon}
              onClick={() => setIsKeybindBoxOpen(!isKeybindBoxOpen)}
              isActive={isKeybindBoxOpen}
            />
            <MenuItem
              label="resize"
              value="resize"
              icon={MinimizeIcon}
              onClick={handleResize}
              isActive={isDimensionBoxOpen}
            />
            <MenuItem
              label="upload"
              value="upload"
              icon={UploadIcon}
              onClick={handleUpload}
            />
            <MenuItem
              label={theme ? "dark mode" : "light mode"}
              value="darkLightToggle"
              icon={theme ? MoonIcon : SunIcon}
              onClick={toggleTheme}
            />
            <MenuItem
              label="reset"
              value="reset"
              icon={ResetIcon}
              onClick={handleReset}
            />
          </ul>
        </div>
        <KeybindBox />
      </div>
    );
  }

  return null;
};

export default MenuBox;
