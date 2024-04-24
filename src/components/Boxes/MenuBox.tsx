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
  ResetIcon,
  PaletteIcon,
  EraserIcon,
  PaintBucketIcon,
  BrushIcon,
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { HorizontalDivider } from "../Divider";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";
import { useKeybindContext } from "../../hooks/useKeybindContext";

interface MenuBoxProps {
  isDimensionBoxOpen: boolean;
  setIsDimensionBoxOpen: Dispatch<SetStateAction<boolean>>;
  isInputFocused: boolean;
}

const MenuBox = ({
  isDimensionBoxOpen,
  setIsDimensionBoxOpen,
  isInputFocused,
}: MenuBoxProps) => {
  const {
    setIsClearModalOpen,
    setIsSaveModalOpen,
    setIsUploadModalOpen,
    cellColors,
    setSwatchColors,
    isMenuBoxOpen,
  } = useControlBarContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const { menuKeybinds, resetKeybinds } = useKeybindContext();

  const hasCellColors: boolean = Object.keys(cellColors).length > 0;

  const handleReset = () => {
    setSwatchColors({});
    resetKeybinds();
  };

  const handleResize = () => {
    setIsDimensionBoxOpen(!isDimensionBoxOpen);
  };

  const handleSave = () => {
    if (hasCellColors) {
      setIsSaveModalOpen(true);
    }
  };

  const handlePublish = () => {
    if (hasCellColors) {
    }
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
    // setIsDimensionBoxOpen(false);
  };

  const handleMinimize = () => {};

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (isInputFocused) return;

      if (e.altKey) {
        switch (e.code) {
          case "KeyR":
            handleResize();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isInputFocused, isDimensionBoxOpen]);

  if (isMenuBoxOpen) {
    return (
      <span>
        <ul className="w-full flex flex-col items-center">
          <MenuItem
            label="reset"
            value="reset"
            keybind={menuKeybinds.reset.keybind}
            icon={ResetIcon}
            onClick={handleReset}
            position="first"
          />
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
            label="resize"
            value="resize"
            keybind={menuKeybinds.resize.keybind}
            icon={GridIcon}
            onClick={handleResize}
            isActive={isDimensionBoxOpen}
          />
          <MenuItem
            label="clear"
            value="clear"
            keybind={menuKeybinds.clear.keybind}
            icon={TrashIcon}
            onClick={handleClear}
          />
          <MenuItem
            label="upload"
            value="upload"
            icon={UploadIcon}
            onClick={handleUpload}
          />
          <MenuItem
            label="save"
            value="save"
            keybind={menuKeybinds.save.keybind}
            icon={DownloadIcon}
            onClick={handleSave}
            disabled={!hasCellColors}
          />
          <MenuItem
            label="publish"
            value="publish"
            icon={CloudUploadIcon}
            onClick={handlePublish}
          />
          <MenuItem
            label={darkMode ? "dark mode" : "light mode"}
            value="darkLightToggle"
            keybind={menuKeybinds.darkLightToggle.keybind}
            icon={darkMode ? MoonIcon : SunIcon}
            onClick={toggleDarkMode}
          />
          <MenuItem
            label="minimize"
            value="minimize"
            keybind={menuKeybinds.minimize.keybind}
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
type MenuItemValue =
  | "paint"
  | "erase"
  | "fill"
  | "picker"
  | "reset"
  | "resize"
  | "clear"
  | "upload"
  | "save"
  | "publish"
  | "darkLightToggle"
  | "minimize";

interface MenuItemProps {
  label: string;
  value: MenuItemValue;
  keybind?: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isActive?: boolean;
  position?: MenuItemPosition;
  disabled?: boolean;
}

const MenuItem = ({
  label,
  value,
  keybind,
  icon: Icon,
  isActive,
  position,
  disabled,
  ...props
}: MenuItemProps) => {
  const { setIsKeybindModalOpen } = useControlBarContext();
  const { setKeybindModalId } = useKeybindContext();

  const openKeybindModal = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setKeybindModalId(value);
    setIsKeybindModalOpen(true);
  };

  return (
    <>
      <li
        className={`px-4 py-2 w-full hover:bg-blue-50 dark:hover:bg-neutral-900 flex flex-row gap-4 items-center cursor-pointer select-none ${
          isActive ? "bg-gray-100 dark:bg-neutral-800" : "bg-transparent"
        } ${
          isActive ? "text-active-blue" : "text-black dark:text-neutral-500"
        } whitespace-nowrap ${disabled && "!cursor-not-allowed"}`}
        {...props}
      >
        <span>
          <Icon width={16} height={16} className={`fill-current`} />
        </span>
        <span>{label}</span>
        {keybind && (
          <span className="w-full text-end">
            <span
              onClick={openKeybindModal}
              className="italic inline-block px-2 py-1 border border-gray-300 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded hover:bg-gray-200 dark:hover:bg-neutral-700 active:bg-gray-300 dark:active:bg-neutral-600"
            >
              {keybind}
            </span>
          </span>
        )}
      </li>
    </>
  );
};

export default MenuBox;
