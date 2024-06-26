import React from "react";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import MenuItem from "./MenuItem";
import {
  BrushIcon,
  DiskIcon,
  EraserIcon,
  MenuIcon,
  MoonIcon,
  PaintBucketIcon,
  PaletteIcon,
  SunIcon,
  TrashIcon,
} from "../Icons";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";
import { useControlBarContext } from "../../hooks/useControlBarContext";

const KeybindBox = () => {
  const { menuKeybinds } = useKeybindContext();
  const { darkMode } = useDarkModeContext();
  const { isKeybindBoxOpen } = useControlBarContext();

  if (isKeybindBoxOpen) {
    return (
      <div className="bg-gray-100 rounded-xl shadow-dark overflow-hidden p-2">
        <ul className="w-full flex flex-col gap-1 items-center">
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
            label="menu"
            value="menu"
            keybind={menuKeybinds.menu.keybind}
            icon={MenuIcon}
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
  }

  return null;
};

export default KeybindBox;
