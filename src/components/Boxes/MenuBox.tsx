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
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { HorizontalDivider } from "../Divider";
import { useDarkModeContext } from "../../hooks/useDarkModeContext";
import KeybindModal from "../Modals/KeybindModal";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import { KeybindMap } from "../../contexts/KeybindProvider";

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
    setSwatchColors,
  } = useControlBarContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const { menuKeybinds } = useKeybindContext();

  const hasCellColors: boolean = Object.keys(cellColors).length > 0;

  const handleReset = () => {
    setSwatchColors({});
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
    // closeMenuBox();
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

  if (isOpen) {
    return (
      <span className="z-20 bg-white dark:bg-default-neutral rounded-lg shadow-dark dark:shadow-light pointer-events-auto">
        <ul className="w-full flex flex-col items-center">
          <MenuItem
            label="reset"
            keybind={menuKeybinds.reset.keybind}
            icon={ResetIcon}
            onClick={handleReset}
            position="first"
          />
          <HorizontalDivider />
          <MenuItem
            label="resize"
            keybind={menuKeybinds.resize.keybind}
            icon={GridIcon}
            onClick={handleResize}
            isActive={isDimensionBoxOpen}
          />
          <HorizontalDivider />
          <MenuItem
            label="clear"
            keybind={menuKeybinds.clear.keybind}
            icon={TrashIcon}
            onClick={handleClear}
          />
          <HorizontalDivider />
          <MenuItem label="upload" icon={UploadIcon} onClick={handleUpload} />
          <HorizontalDivider />
          <MenuItem
            label="save"
            keybind={menuKeybinds.save.keybind}
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
            keybind={menuKeybinds.darkLightToggle?.keybind}
            icon={darkMode ? MoonIcon : SunIcon}
            onClick={toggleDarkMode}
          />
          <HorizontalDivider />
          <MenuItem
            label="minimize"
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
  const { setIsKeybindModalOpen, keybindModalId, setKeybindModalId } =
    useControlBarContext();
  const { setMenuKeybinds } = useKeybindContext();

  const openKeybindModal = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsKeybindModalOpen(true);
    setKeybindModalId(label);
  };

  const updateKeybind = (newKeybind: string) => {
    setMenuKeybinds((prevMenuKeybind: KeybindMap) => ({
      ...prevMenuKeybind,
      [label]: {
        keybind: newKeybind,
      },
    }));
    setIsKeybindModalOpen(false);
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
      {keybind && keybindModalId === label && (
        <KeybindModal currentKeybind={keybind} onSave={updateKeybind} />
      )}
    </>
  );
};

export default MenuBox;
