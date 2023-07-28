import React, { Dispatch, SetStateAction } from "react";
import { TrashIcon, DownloadIcon, UploadIcon, GridIcon } from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";

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

  if (isActive) {
    return (
      <span className="z-20 w-44 bg-white rounded-lg shadow-cover">
        <ul className="w-full flex flex-col p-4 items-center">
          <MenuItem
            label="resize"
            icon={GridIcon}
            onClick={handleResize}
            isActive={isDimensionBoxOpen}
          />
          <HorizontalDivider />
          <MenuItem label="clear" icon={TrashIcon} onClick={handleClear} />
          <HorizontalDivider />
          <MenuItem label="upload" icon={UploadIcon} onClick={handleUpload} />
          <HorizontalDivider />
          <MenuItem label="save" icon={DownloadIcon} onClick={handleSave} />
        </ul>
      </span>
    );
  }

  return null;
};

const HorizontalDivider = () => {
  return <span className="w-11/12 h-px bg-slate-200"></span>;
};

const neutralFg: string = "#000000";
const activeFg: string = "#7d87e2";

interface MenuItemProps {
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  isActive?: boolean;
}

const MenuItem = ({ label, icon: Icon, isActive, ...props }: MenuItemProps) => {
  return (
    <li
      className={`rounded-lg px-4 py-2 w-full hover:bg-red-50 flex flex-row gap-4 items-center cursor-pointer select-none ${
        isActive ? "bg-gray-100" : "bg-transparent"
      }`}
      {...props}
    >
      <Icon width={16} height={16} fill={isActive ? activeFg : neutralFg} />
      <span style={{ color: isActive ? activeFg : neutralFg }}>{label}</span>
    </li>
  );
};

export default MenuBox;
