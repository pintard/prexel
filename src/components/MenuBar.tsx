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
    // setIsDimensionBoxOpen(false);
  };

  return (
    <div className="w-full p-1 pr-4 flex flex-row items-center justify-between gap-1 select-none pointer-events-auto">
      <div>
        <Link to="/">
          <IconButton icon={HouseIcon} />
        </Link>
        <IconButton icon={TrashIcon} onClick={handleClear} />
      </div>
      <div>
        <IconButton
          icon={CloudUploadIcon}
          onClick={handlePublish}
          isDisabled={!hasCellColors}
        />
        <IconButton
          icon={DiskIcon}
          onClick={handleSave}
          isDisabled={!hasCellColors}
        />
      </div>
    </div>
  );
};

export default MenuBar;
