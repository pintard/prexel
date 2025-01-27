import { Link } from "react-router-dom";
import IconButton from "./IconButton";
import { DownloadIcon, GlobeIcon, HouseIcon, TrashIcon } from "./Icons";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { useKeybindContext } from "../hooks/useKeybindContext";
import { useEffect } from "react";

const MenuBar = () => {
  const {
    cellColors,
    setIsSaveModalOpen,
    setIsPublishModalOpen,
    setIsClearModalOpen,
  } = useControlBarContext();
  const { onKeybindTriggered, triggeredAction } = useKeybindContext();

  const hasCellColors: boolean = Object.keys(cellColors).length > 0;

  useEffect(() => {
    onKeybindTriggered((action: string) => {
      handleCustomKeybindAction(action);
    });
  }, [triggeredAction]);

  const handleCustomKeybindAction = (action: string) => {
    switch (action) {
      case "save":
        handleSave();
        break;
      case "clear":
        handleClear();
        break;
      default:
        break;
    }
  };

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
          icon={DownloadIcon}
          onClick={handleSave}
          isDisabled={!hasCellColors}
        />
        <IconButton
          icon={GlobeIcon}
          onClick={handlePublish}
          isDisabled={!hasCellColors}
        />
      </div>
    </div>
  );
};

export default MenuBar;
