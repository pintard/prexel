import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { ReactComponent as BrushIcon } from "../images/brush-alt.svg";
import { ReactComponent as CompassIcon } from "../images/compass.svg";
import { ReactComponent as EraserIcon } from "../images/eraser.svg";
import { ReactComponent as PaintBucketIcon } from "../images/paint-bucket-alt.svg";
import { ReactComponent as PalletIcon } from "../images/pallet.svg";
import DimensionBox from "./DimensionBox";
import ColorPicker from "./ColorPicker";

const ControlBar = () => {
  const { activeControl, setActiveControl } = useControlBarContext();
  const [isFocused, setIsFocused] = useState(false);

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

  const exitMode = () => {
    setActiveControl(null);
  };

  return (
    <div className="absolute top-10 flex flex-col items-center">
      <span className="p-1 h-14 mb-4 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1">
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

interface IconButtonProps {
  option?: number;
  isActive: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

const IconButton = ({
  option,
  icon: Icon,
  isActive,
  ...props
}: IconButtonProps) => {
  const neutralFG: string = "#8d8d8d";

  return (
    <button
      className={`relative ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } rounded-lg p-3 hover:bg-red-50 focus:outline-none border-solid border border-transparent active:border-red-200 `}
      {...props}
    >
      <Icon width={22} height={22} fill={neutralFG} />
      <span className="absolute bottom-1 right-2 text-zinc-400 text-xxs">
        {option}
      </span>
    </button>
  );
};

export default ControlBar;
