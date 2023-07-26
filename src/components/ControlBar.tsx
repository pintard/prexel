import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { ReactComponent as BrushIcon } from "../images/brush-alt.svg";
import { ReactComponent as CompassIcon } from "../images/compass.svg";
import { ReactComponent as EraserIcon } from "../images/eraser.svg";
import { ReactComponent as PaintBucketIcon } from "../images/paint-bucket-alt.svg";
import { ReactComponent as PalletIcon } from "../images/pallet.svg";
import { ReactComponent as TrashIcon } from "../images/trash-can.svg";
import { ReactComponent as DownloadIcon } from "../images/download.svg";
import DimensionBox from "./DimensionBox";
import ColorPicker from "./ColorPicker";

interface ControlBarProps {
  openClearModal: () => void;
  openSaveModal: () => void;
}

const ControlBar = ({ openClearModal, openSaveModal }: ControlBarProps) => {
  const { activeControl, setActiveControl } = useControlBarContext();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFocused) return;

      switch (e.key) {
        case "1":
          openDimensionBox();
          break;
        case "2":
          openColorPickerBox();
          break;
        case "3":
          setPaintMode();
          break;
        case "4":
          setFillMode();
          break;
        case "5":
          setEraseMode();
          break;
        case "Escape":
          exitMode();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFocused, activeControl]);

  const openDimensionBox = () => {
    setActiveControl(
      activeControl === "DimensionControl" ? null : "DimensionControl"
    );
  };

  const openColorPickerBox = () => {
    setActiveControl(
      activeControl === "ColorPickControl" ? null : "ColorPickControl"
    );
  };

  const setPaintMode = () => {
    setActiveControl(activeControl === "PaintControl" ? null : "PaintControl");
  };

  const setFillMode = () => {
    setActiveControl(activeControl === "FillControl" ? null : "FillControl");
  };

  const setEraseMode = () => {
    setActiveControl(activeControl === "EraseControl" ? null : "EraseControl");
  };

  const handleSaveControl = () => {
    openSaveModal();
    exitMode();
  };

  const handleClearControl = () => {
    openClearModal();
    exitMode();
  };

  const exitMode = () => {
    setActiveControl(null);
  };

  return (
    <div className="absolute top-10 flex flex-col items-center">
      <span className="p-1 h-12 mb-4 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1">
        <IconButton
          option={1}
          isActive={activeControl === "DimensionControl"}
          icon={CompassIcon}
          onClick={openDimensionBox}
        />
        <IconButton
          option={2}
          isActive={activeControl === "ColorPickControl"}
          icon={PalletIcon}
          onClick={openColorPickerBox}
        />
        <IconButton
          option={3}
          isActive={activeControl === "PaintControl"}
          icon={BrushIcon}
          onClick={setPaintMode}
        />
        <IconButton
          option={4}
          isActive={activeControl === "FillControl"}
          icon={PaintBucketIcon}
          onClick={setFillMode}
        />
        <IconButton
          option={5}
          isActive={activeControl === "EraseControl"}
          icon={EraserIcon}
          onClick={setEraseMode}
        />
        <VerticalDivider />
        <IconButton icon={TrashIcon} onClick={handleClearControl} />
        <IconButton icon={DownloadIcon} onClick={handleSaveControl} />
      </span>
      <DimensionBox
        isActive={activeControl === "DimensionControl"}
        setIsFocused={setIsFocused}
      />
      <ColorPicker
        isActive={activeControl === "ColorPickControl"}
        setIsFocused={setIsFocused}
      />
    </div>
  );
};

const VerticalDivider = () => {
  return <span className="h-3/5 w-px bg-slate-200"></span>;
};

interface IconButtonProps {
  option?: number;
  isActive?: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const IconButton = ({
  option,
  icon: Icon,
  isActive,
  ...props
}: IconButtonProps) => {
  const neutralFg: string = "#8d8d8d";
  const activeFg: string = "#7d87e2";

  return (
    <button
      className={`relative ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-red-50 focus:outline-none border-solid border border-transparent active:border-red-200 `}
      {...props}
    >
      <Icon width={18} height={18} fill={isActive ? activeFg : neutralFg} />
      <span className="absolute bottom-1 right-1 text-zinc-400 text-xxs">
        {option}
      </span>
    </button>
  );
};

export default ControlBar;
