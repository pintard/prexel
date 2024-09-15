import React from "react";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import MenuItem from "./MenuItem";
import {
  BrushIcon,
  DiskIcon,
  DownloadIcon,
  DropIcon,
  EraserIcon,
  MenuIcon,
  MoonIcon,
  PaintBucketIcon,
  PaletteIcon,
  PencilIcon,
  SunIcon,
  TrashIcon,
} from "../Icons";
import { useTheme } from "../../hooks/useTheme";
import { useControlBarContext } from "../../hooks/useControlBarContext";

const KeybindBox = () => {
  const { menuKeybinds } = useKeybindContext();
  const { theme } = useTheme();
  const { isKeybindBoxOpen } = useControlBarContext();

  if (isKeybindBoxOpen) {
    return (
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl shadow-dark overflow-hidden p-2 border border-gray-300 dark:border-neutral-600">
        <ul className="w-full flex flex-col gap-1 items-center">
          <MenuItem
            label="paint"
            value="paint"
            keybind={menuKeybinds.paint.keybind}
            icon={PencilIcon}
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
            icon={DropIcon}
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
            icon={DownloadIcon}
          />
          <MenuItem
            label={theme ? "dark mode" : "light mode"}
            value="darkLightToggle"
            keybind={menuKeybinds.darkLightToggle.keybind}
            icon={theme ? MoonIcon : SunIcon}
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
