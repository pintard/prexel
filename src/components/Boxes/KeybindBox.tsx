import React from "react";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import MenuItem from "./MenuItem";
import {
  BrushIcon,
  DiskIcon,
  EraserIcon,
  MoonIcon,
  PaintBucketIcon,
  PaletteIcon,
  SunIcon,
  TrashIcon,
} from "../Icons";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";

interface KeybindBoxProps {
  isVisible: boolean;
}

const KeybindBox = ({ isVisible }: KeybindBoxProps) => {
  const { menuKeybinds } = useKeybindContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-gray-100 rounded-xl shadow-dark overflow-hidden">
      <ul className="w-full flex flex-col items-center">
        <MenuItem
          label="paint"
          value="paint"
          keybind={menuKeybinds.paint.keybind}
          icon={BrushIcon}
        />
        <MenuItem
          label="erase"
          value="erase"
          keybind={menuKeybinds.erase.keybind}
          icon={EraserIcon}
        />
        <MenuItem
          label="fill"
          value="fill"
          keybind={menuKeybinds.fill.keybind}
          icon={PaintBucketIcon}
        />
        <MenuItem
          label="picker"
          value="picker"
          keybind={menuKeybinds.picker.keybind}
          icon={PaletteIcon}
        />
        <MenuItem
          label="save"
          value="save"
          keybind={menuKeybinds.save.keybind}
          icon={DiskIcon}
        />
        <MenuItem
          label={darkMode ? "dark mode" : "light mode"}
          value="darkLightToggle"
          keybind={menuKeybinds.darkLightToggle.keybind}
          icon={darkMode ? MoonIcon : SunIcon}
        />
        <MenuItem
          label="clear"
          value="clear"
          keybind={menuKeybinds.clear.keybind}
          icon={TrashIcon}
        />
      </ul>
    </div>
  );
};

export default KeybindBox;
