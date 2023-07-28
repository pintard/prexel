import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import {
  BrushIcon,
  EraserIcon,
  PaintBucketIcon,
  PaletteIcon,
  MenuIcon,
  GripIcon,
} from "./Icons";
import DimensionBox from "./Boxes/DimensionBox";
import ColorPickerBox from "./Boxes/ColorPickerBox";
import MenuBox from "./Boxes/MenuBox";
import { ActiveControl } from "../contexts/ControlBarProvider";
import IconButton from "./IconButton";

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
  const [controlBarPosition, setControlBarPosition] = useState({
    left: 0,
    top: 0,
  });

  const controlBarRef = useRef<HTMLDivElement>(null);

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

  // const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   const { clientX, clientY } = e;
  //   const controlBarRect = e.currentTarget.getBoundingClientRect();
  //   const offsetX = clientX - controlBarRect.left;
  //   const offsetY = clientY - controlBarRect.top;
  //   setControlBarPosition({ left: offsetX, top: offsetY });
  // };

  // const handleMouseUp = () => {};

  const handleMouseMove = (offsetX: number, offsetY: number) => {
    const pageWidth = document.documentElement.clientWidth;
    const pageHeight = document.documentElement.clientHeight;
    const maxLeft = pageWidth - controlBarRef.current!.clientWidth;
    const maxTop = pageHeight - controlBarRef.current!.clientHeight;
    setControlBarPosition({
      left: Math.max(0, Math.min(offsetX, maxLeft)),
      top: Math.max(0, Math.min(offsetY, maxTop)),
    });
  };

  return (
    <div
      ref={controlBarRef}
      className="absolute flex flex-col items-center"
      style={{
        left: controlBarPosition.left,
        top: controlBarPosition.top,
      }}
    >
      <span className="z-20 p-1 h-12 mb-4 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1">
        <ControlBarHandle icon={GripIcon} onDrag={handleMouseMove} />
        <IconButton
          option={1}
          isActive={isColorPickerBoxOpen}
          icon={PaletteIcon}
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
          isDimensionBoxOpen={isDimensionBoxOpen}
          setIsDimensionBoxOpen={setIsDimensionBoxOpen}
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

interface ControlBarHandleProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onDrag: (offsetX: number, offsetY: number) => void;
}

const ControlBarHandle = ({ icon: Icon, onDrag }: ControlBarHandleProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMouseDown) {
      const offsetX = e.clientX - e.currentTarget.offsetLeft;
      const offsetY = e.clientY - e.currentTarget.offsetTop;
      onDrag(offsetX, offsetY);
    }
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <span
      className="p-2.5 px-0 cursor-grab"
      style={{ cursor: isMouseDown ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Icon width={18} height={18} fill={isMouseDown ? activeFg : neutralFg} />
    </span>
  );
};

export default ControlBar;
