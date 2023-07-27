import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import {
  BrushIcon,
  CompassIcon,
  EraserIcon,
  PaintBucketIcon,
  PalletIcon,
  MenuIcon,
  MoveIcon,
} from "./Icons";
import DimensionBox from "./Boxes/DimensionBox";
import ColorPickerBox from "./Boxes/ColorPickerBox";
import MenuBox from "./Boxes/MenuBox";
import { ActiveControl } from "../contexts/ControlBarProvider";

const ControlBar = () => {
  const {
    activeControl,
    setActiveControl,
    color,
    setColor,
    swatchColors,
    swatchHotKeys,
  } = useControlBarContext();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isMenuBoxOpen, setIsMenuBoxOpen] = useState(false);
  const [isDimensionBoxOpen, setIsDimensionBoxOpen] = useState(false);
  const [isColorPickerBoxOpen, setIsColorPickerBoxOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFocused) return;

      switch (e.key) {
        case "1":
          setIsColorPickerBoxOpen(!isColorPickerBoxOpen);
          break;
        case "2":
          toggleActiveControl("PaintControl");
          break;
        case "3":
          toggleActiveControl("FillControl");
          break;
        case "4":
          toggleActiveControl("EraseControl");
          break;
        case "Escape":
          setActiveControl(null);
          setIsColorPickerBoxOpen(false);
          setIsDimensionBoxOpen(false);
          break;
        default:
          if (swatchHotKeys.includes(e.key)) {
            setColor(swatchColors[e.key] ?? color); // TODO going back to the color before, not the last
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isFocused, activeControl, swatchColors, isColorPickerBoxOpen]);

  const toggleActiveControl = (control: ActiveControl) => {
    setActiveControl(activeControl === control ? null : control);
  };

  return (
    <div className="absolute top-10 flex flex-col items-center">
      <span className="p-1 h-12 mb-4 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1">
        <ControlBarHandle icon={MoveIcon} />
        <IconButton
          isActive={isDimensionBoxOpen}
          icon={CompassIcon}
          onClick={() => setIsDimensionBoxOpen(!isDimensionBoxOpen)}
        />
        <VerticalDivider />
        <IconButton
          option={1}
          isActive={isColorPickerBoxOpen}
          icon={PalletIcon}
          onClick={() => setIsColorPickerBoxOpen(!isColorPickerBoxOpen)}
        />
        <IconButton
          option={2}
          isActive={activeControl === "PaintControl"}
          icon={BrushIcon}
          onClick={() => toggleActiveControl("PaintControl")}
        />
        <IconButton
          option={3}
          isActive={activeControl === "FillControl"}
          icon={PaintBucketIcon}
          onClick={() => toggleActiveControl("FillControl")}
        />
        <IconButton
          option={4}
          isActive={activeControl === "EraseControl"}
          icon={EraserIcon}
          onClick={() => toggleActiveControl("EraseControl")}
        />
        <VerticalDivider />
        <IconButton
          isActive={isMenuBoxOpen}
          icon={MenuIcon}
          onClick={() => setIsMenuBoxOpen(!isMenuBoxOpen)}
        />
      </span>

      <div className="w-full flex flex-row gap-6 items-start justify-center">
        <DimensionBox
          isActive={isDimensionBoxOpen}
          setIsFocused={setIsFocused}
        />
        <ColorPickerBox
          isActive={isColorPickerBoxOpen}
          setIsFocused={setIsFocused}
        />
        <MenuBox
          isActive={isMenuBoxOpen}
          closeMenuBox={() => setIsMenuBoxOpen(false)}
        />
      </div>
    </div>
  );
};

const VerticalDivider = () => {
  return <span className="h-3/5 w-px bg-slate-200"></span>;
};

const neutralFg: string = "#8d8d8d";
const activeFg: string = "#7d87e2";

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
  return (
    <button
      className={`relative ${
        isActive ? "bg-gray-100" : "bg-transparent"
      } rounded-lg p-2.5 hover:bg-red-50 focus:outline-none border-solid border border-transparent active:border-red-200 select-none`}
      {...props}
    >
      <Icon width={18} height={18} fill={isActive ? activeFg : neutralFg} />
      <span className="absolute bottom-1 right-1 text-zinc-400 text-xxs">
        {option}
      </span>
    </button>
  );
};

interface ControlBarHandleProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const ControlBarHandle = ({ icon: Icon }: ControlBarHandleProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <span
      className="p-2.5 pr-0 cursor-grab"
      style={{ cursor: isMouseDown ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <Icon width={18} height={18} fill={isMouseDown ? activeFg : neutralFg} />
    </span>
  );
};

export default ControlBar;
