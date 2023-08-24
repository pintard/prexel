import React, { Dispatch, SetStateAction } from "react";
import {
  TrashIcon,
  DownloadIcon,
  UploadIcon,
  GridIcon,
  MinimizeIcon,
  CloudUploadIcon,
} from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { theme } from "../../utils/constants";
import { HorizontalDivider } from "../Divider";

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

  // TODO minimize functionality
  if (isActive) {
    return (
      <span className="z-20 w-44 bg-white rounded-lg shadow-cover pointer-events-auto">
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
            label="dark mode"
            icon={CloudUploadIcon}
            onClick={handlePublish}
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

type MenuItemPosition = "first" | "middle" | "last";

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
        fill={isActive ? theme.ACTIVE_BLUE_FG : theme.NEUTRAL_BLACK_FG}
      />
      <span
        style={{
          color: isActive ? theme.ACTIVE_BLUE_FG : theme.NEUTRAL_BLACK_FG,
        }}
      >
        {label}
      </span>
    </li>
  );
};

export default MenuBox;
