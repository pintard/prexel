import { Link } from "react-router-dom";
import IconButton from "./IconButton";
import { CloudUploadIcon, DiskIcon, HouseIcon, TrashIcon } from "./Icons";
import { useControlBarContext } from "../hooks/useControlBarContext";

const MenuBar = () => {
  const {
    cellColors,
    setIsSaveModalOpen,
    setIsPublishModalOpen,
    setIsClearModalOpen,
  } = useControlBarContext();

  const hasCellColors: boolean = Object.keys(cellColors).length > 0;

  const handleSave = () => {
    if (hasCellColors) {
      setIsSaveModalOpen(true);
    }
  };

  const handlePublish = () => {
    if (hasCellColors) {
      setIsPublishModalOpen(true);
    }
  };

  const handleClear = () => {
    setIsClearModalOpen(true);
  };

  return (
    <div className="w-full py-2 pr-6 flex flex-row items-center justify-between select-none pointer-events-auto">
      <div className="flex flex-row gap-1">
        <Link to="/">
          <IconButton icon={HouseIcon} />
        </Link>
        <IconButton icon={TrashIcon} onClick={handleClear} />
      </div>
      <div className="flex flex-row gap-1">
        <IconButton
          icon={DiskIcon}
          onClick={handleSave}
          isDisabled={!hasCellColors}
        />
        <IconButton
          icon={CloudUploadIcon}
          onClick={handlePublish}
          isDisabled={!hasCellColors}
        />
      </div>
    </div>
  );
};

export default MenuBar;
