import React from "react";
import { TrashIcon, DownloadIcon, UploadIcon } from "../Icons";
import { useControlBarContext } from "../../hooks/useControlBarContext";

interface MenuBoxProps {
  isActive: boolean;
  closeMenuBox: () => void;
}

const MenuBox = ({ isActive, closeMenuBox }: MenuBoxProps) => {
  const { setIsClearModalOpen, setIsSaveModalOpen, setIsUploadModalOpen } =
    useControlBarContext();

  const handleSave = () => {
    setIsSaveModalOpen(true);
    closeMenuBox();
  };

  const handleUpload = () => {
    setIsUploadModalOpen(true);
    closeMenuBox();
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
    closeMenuBox();
  };

  if (isActive) {
    return (
      <span className="z-20 w-44 bg-white rounded-lg shadow-cover">
        <ul className="w-full flex flex-col p-4 items-center">
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

interface MenuItemProps {
  label: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const MenuItem = ({ label, icon: Icon, ...props }: MenuItemProps) => {
  return (
    <li
      className="rounded-lg px-4 py-2 w-full hover:bg-gray-100 flex flex-row gap-4 items-center cursor-pointer select-none"
      {...props}
    >
      <Icon width={16} height={16} />
      <span>{label}</span>
    </li>
  );
};

export default MenuBox;
