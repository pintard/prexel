import React, { Dispatch, SetStateAction, useEffect } from "react";
import {
  TrashIcon,
  DownloadIcon,
  UploadIcon,
  GridIcon,
  MinimizeIcon,
  CloudUploadIcon,
  MoonIcon,
  SunIcon,
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { HorizontalDivider } from "../Divider";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";
import { getOperatingSystem } from "../../utils/platformUtils";
import { StringHash } from "../../utils/constants";

type ModifierKey = "\u2325" | "alt";

const modifierKey: ModifierKey =
  getOperatingSystem() === "Mac" ? "\u2325" : "alt";

const MENU_KEYBINDS: StringHash = {
  resize: `${modifierKey} + R`,
  clear: `${modifierKey} + shift + C`,
  upload: `${modifierKey} + U`,
  save: `${modifierKey} + S`,
  publish: `${modifierKey} + P`,
  darkLightToggle: `${modifierKey} + D`,
  minimize: `${modifierKey} + M`,
};

interface MenuBoxProps {
  isOpen: boolean;
  closeMenuBox: () => void;
  isDimensionBoxOpen: boolean;
  setIsDimensionBoxOpen: Dispatch<SetStateAction<boolean>>;
  isInputFocused: boolean;
}

const MenuBox = ({
  isOpen,
  closeMenuBox,
  isDimensionBoxOpen,
  setIsDimensionBoxOpen,
  isInputFocused,
}: MenuBoxProps) => {
  const {
    setIsClearModalOpen,
    setIsSaveModalOpen,
    setIsUploadModalOpen,
    cellColors,
  } = useControlBarContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  const hasCellColors: boolean = Object.keys(cellColors).length > 0;

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isInputFocused) return;

      switch (e.key) {
        case "1":
          break;
        case "2":
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const handleResize = () => {
    setIsDimensionBoxOpen(!isDimensionBoxOpen);
  };

  const handleSave = () => {
    if (hasCellColors) {
      setIsSaveModalOpen(true);
    }

    // closeMenuBox();
    // setIsDimensionBoxOpen(false);
  };

  const handlePublish = () => {};

  const handleUpload = () => {
    setIsUploadModalOpen(true);
    // closeMenuBox();
    // setIsDimensionBoxOpen(false);
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
    // closeMenuBox();
    // setIsDimensionBoxOpen(false);
  };

  const handleMinimize = () => {};

  if (isOpen) {
    return (
      <span className="z-20 bg-white dark:bg-default-neutral rounded-lg shadow-cover pointer-events-auto">
        <ul className="w-full flex flex-col items-center">
          <MenuItem
            label="resize"
            icon={GridIcon}
            onClick={handleResize}
            isActive={isDimensionBoxOpen}
            position="first"
          />
          <HorizontalDivider />
          <MenuItem
            label="clear"
            keybind={MENU_KEYBINDS.clear}
            icon={TrashIcon}
            onClick={handleClear}
          />
          <HorizontalDivider />
          <MenuItem label="upload" icon={UploadIcon} onClick={handleUpload} />
          <HorizontalDivider />
          <MenuItem
            label="save"
            keybind={MENU_KEYBINDS.save}
            icon={DownloadIcon}
            onClick={handleSave}
            disabled={!hasCellColors}
          />
          <HorizontalDivider />
          <MenuItem
            label="publish"
            icon={CloudUploadIcon}
            onClick={handlePublish}
          />
          <HorizontalDivider />
          <MenuItem
            label={darkMode ? "dark mode" : "light mode"}
            keybind={MENU_KEYBINDS.darkLightToggle}
            icon={darkMode ? MoonIcon : SunIcon}
            onClick={toggleDarkMode}
          />
          <HorizontalDivider />
          <MenuItem
            label="minimize"
            icon={MinimizeIcon}
            onClick={handleMinimize}
            position="last"
          />
        </ul>
      </span>
    );
  }

  return null;
};

type MenuItemPosition = "first" | "last";

interface MenuItemProps {
  label: string;
  keybind?: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isActive?: boolean;
  position?: MenuItemPosition;
  disabled?: boolean;
}

const MenuItem = ({
  label,
  keybind,
  icon: Icon,
  isActive,
  position,
  disabled,
  ...props
}: MenuItemProps) => {
  let borderRadius: string = "";

  switch (position) {
    case "first":
      borderRadius = "rounded-t-lg";
      break;
    case "last":
      borderRadius = "rounded-b-lg";
      break;
    default:
      borderRadius = "";
      break;
  }

  return (
    <li
      className={`px-4 py-2 w-full hover:bg-blue-50 dark:hover:bg-neutral-900 flex flex-row gap-4 items-center cursor-pointer select-none ${
        isActive ? "bg-gray-100 dark:bg-neutral-800" : "bg-transparent"
      } ${borderRadius} ${
        isActive ? "text-active-blue" : "text-black dark:text-neutral-500"
      } whitespace-nowrap ${disabled && "cursor-not-allowed"}`}
      {...props}
    >
      <span>
        <Icon width={16} height={16} className={`fill-current`} />
      </span>
      <span>{label}</span>
      {keybind && (
        <span className="w-full text-end">
          <span className="italic inline-block px-2 py-1 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded">
            {keybind}
          </span>
        </span>
      )}
    </li>
  );
};

export default MenuBox;
