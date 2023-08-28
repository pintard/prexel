import React, { Dispatch, SetStateAction } from "react";
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

interface MenuBoxProps {
  isActive: boolean;
  closeMenuBox: () => void;
  isDimensionBoxOpen: boolean;
  setIsDimensionBoxOpen: Dispatch<SetStateAction<boolean>>;
}

const MenuBox = ({
  isActive,
  closeMenuBox,
  isDimensionBoxOpen,
  setIsDimensionBoxOpen,
}: MenuBoxProps) => {
  const { setIsClearModalOpen, setIsSaveModalOpen, setIsUploadModalOpen } =
    useControlBarContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();

  const handleResize = () => {
    setIsDimensionBoxOpen(!isDimensionBoxOpen);
  };

  const handleSave = () => {
    setIsSaveModalOpen(true);
    closeMenuBox();
    setIsDimensionBoxOpen(false);
  };

  const handlePublish = () => {};

  const handleUpload = () => {
    setIsUploadModalOpen(true);
    closeMenuBox();
    setIsDimensionBoxOpen(false);
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
    closeMenuBox();
    setIsDimensionBoxOpen(false);
  };

  const handleMinimize = () => {};

  if (isActive) {
    return (
      <span className="z-20 w-44 bg-white dark:bg-default-neutral rounded-lg shadow-cover pointer-events-auto">
        <ul className="w-full flex flex-col items-center">
          <MenuItem
            label="resize"
            icon={GridIcon}
            onClick={handleResize}
            isActive={isDimensionBoxOpen}
            position="first"
          />
          <HorizontalDivider />
          <MenuItem label="clear" icon={TrashIcon} onClick={handleClear} />
          <HorizontalDivider />
          <MenuItem label="upload" icon={UploadIcon} onClick={handleUpload} />
          <HorizontalDivider />
          <MenuItem label="save" icon={DownloadIcon} onClick={handleSave} />
          <HorizontalDivider />
          <MenuItem
            label="publish"
            icon={CloudUploadIcon}
            onClick={handlePublish}
          />
          <HorizontalDivider />
          <MenuItem
            label={darkMode ? "dark mode" : "light mode"}
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
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isActive?: boolean;
  position?: MenuItemPosition;
}

const MenuItem = ({
  label,
  icon: Icon,
  isActive,
  position,
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
      className={`px-4 py-2 w-full hover:bg-blue-50 flex flex-row gap-4 items-center cursor-pointer select-none ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } ${borderRadius}`}
      {...props}
    >
      <Icon
        width={16}
        height={16}
        className={`fill-current ${
          isActive ? "text-active-blue" : "text-black"
        } dark:text-neutral-500`}
      />
      <span
        className={`${
          isActive ? "text-active-blue" : "text-black"
        } dark:text-neutral-500`}
      >
        {label}
      </span>
    </li>
  );
};

export default MenuBox;
