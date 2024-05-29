import React from "react";
import {
  UploadIcon,
  GridIcon,
  MoonIcon,
  SunIcon,
  ResetIcon,
  KeysIcon,
  MinimizeIcon,
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import MenuItem from "./MenuItem";
import KeybindBox from "./KeybindBox";

const MenuBox = () => {
  const {
    setIsUploadModalOpen,
    setSwatchColors,
    isMenuBoxOpen,
    setIsMenuBoxOpen,
    isDimensionBoxOpen,
    setIsDimensionBoxOpen,
    isInputFocused,
    isKeybindBoxOpen,
    setIsKeybindBoxOpen,
  } = useControlBarContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const { resetKeybinds } = useKeybindContext();

  const handleReset = () => {
    setSwatchColors({});
    resetKeybinds();
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
        <div className="bg-gray-100 rounded-xl shadow-dark overflow-hidden p-2">
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
              label={darkMode ? "dark mode" : "light mode"}
              value="darkLightToggle"
              icon={darkMode ? MoonIcon : SunIcon}
              onClick={toggleDarkMode}
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
