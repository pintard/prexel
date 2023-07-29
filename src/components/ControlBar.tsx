import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { theme } from "../utils/constants";

const ControlBar = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isMenuBoxOpen, setIsMenuBoxOpen] = useState(false);
  const [isDimensionBoxOpen, setIsDimensionBoxOpen] = useState(false);
  const [isColorPickerBoxOpen, setIsColorPickerBoxOpen] = useState(false);
  const [isBoxAreaOpen, setIsBoxAreaOpen] = useState(false);
  const [controlBarPosition, setControlBarPosition] = useState({
    left: 0,
    top: 0,
  });

  const {
    activeControl,
    setActiveControl,
    color,
    setColor,
    swatchColors,
    swatchHotKeys,
  } = useControlBarContext();

  const controlBarAreaRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (controlBarAreaRef.current) {
      const controlBarWidth: number = controlBarAreaRef.current.offsetWidth;
      setControlBarPosition({
        left: (window.innerWidth - controlBarWidth) / 2,
        top: 40,
      });
    }
  }, []);

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
        case "/":
          setIsMenuBoxOpen(!isMenuBoxOpen);
          break;
        case "Escape":
          setActiveControl(null);
          setIsColorPickerBoxOpen(false);
          setIsDimensionBoxOpen(false);
          if (isDimensionBoxOpen || isColorPickerBoxOpen) {
            return;
          } else {
            setIsMenuBoxOpen(false);
          }
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
  }, [
    isFocused,
    activeControl,
    swatchColors,
    isColorPickerBoxOpen,
    isMenuBoxOpen,
  ]);

  useEffect(() => {
    setIsBoxAreaOpen(
      isMenuBoxOpen || isDimensionBoxOpen || isColorPickerBoxOpen
    );
  }, [isMenuBoxOpen, isDimensionBoxOpen, isColorPickerBoxOpen]);

  const toggleActiveControl = (control: ActiveControl) => {
    setActiveControl(activeControl === control ? null : control);
  };

  const handleMouseMove = (offsetX: number, offsetY: number) => {
    const pageWidth = document.documentElement.clientWidth;
    const pageHeight = document.documentElement.clientHeight;
    const maxLeft = pageWidth - controlBarAreaRef.current!.clientWidth;
    const maxTop = pageHeight - controlBarAreaRef.current!.clientHeight;

    setControlBarPosition((prevPosition) => ({
      left: Math.max(0, Math.min(prevPosition.left + offsetX, maxLeft)),
      top: Math.max(0, Math.min(prevPosition.top + offsetY, maxTop)),
    }));
  };

  return (
    <div
      ref={controlBarAreaRef}
      className="absolute flex flex-col items-center"
      style={{
        left: controlBarPosition.left,
        top: controlBarPosition.top,
      }}
    >
      <span className="z-20 p-1 h-12 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1">
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

      <div
        className={`w-full mt-4 flex flex-row gap-6 items-start justify-center ${
          !isBoxAreaOpen && "hidden"
        }`}
      >
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

interface ControlBarHandleProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onDrag: (offsetX: number, offsetY: number) => void;
}

const ControlBarHandle = ({ icon: Icon, onDrag }: ControlBarHandleProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const initialPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsMouseDown(true);
    initialPos.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isMouseDown) {
      const offsetX = e.clientX - initialPos.current.x;
      const offsetY = e.clientY - initialPos.current.y;
      onDrag(offsetX, offsetY);
      initialPos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  useEffect(() => {
    if (isMouseDown) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMouseDown]);

  return (
    <span
      className="p-2.5 px-0 cursor-grab"
      style={{ cursor: isMouseDown ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Icon
        width={18}
        height={18}
        fill={isMouseDown ? theme.ACTIVE_BLUE_FG : theme.NEUTRAL_GRAY_FG}
      />
    </span>
  );
};

export default ControlBar;
