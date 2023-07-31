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
          toggleActiveControl("PaintControl");
          break;
        case "2":
          toggleActiveControl("EraseControl");
          break;
        case "3":
          toggleActiveControl("FillControl");
          break;
        case "4":
          setIsColorPickerBoxOpen(!isColorPickerBoxOpen);
          break;
        case "/":
          setIsMenuBoxOpen(!isMenuBoxOpen);
          break;
        case "Escape":
          if (isDimensionBoxOpen) {
            setIsDimensionBoxOpen(false);
          } else if (isMenuBoxOpen) {
            setIsMenuBoxOpen(false);
          } else if (isColorPickerBoxOpen) {
            setIsColorPickerBoxOpen(false);
          } else {
            setActiveControl(null);
          }
          break;
        default:
          if (swatchHotKeys.includes(e.key)) {
            setColor(swatchColors[e.key] ?? color);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    color,
    isFocused,
    swatchColors,
    activeControl,
    isColorPickerBoxOpen,
    isMenuBoxOpen,
    isDimensionBoxOpen,
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
      <span className="z-20 p-1 h-12 bg-white rounded-lg shadow-cover flex flex-row justify-between items-center gap-1 select-none">
        <ControlBarHandle icon={GripIcon} onDrag={handleMouseMove} />
        <IconButton
          option={1}
          isActive={activeControl === "PaintControl"}
          icon={BrushIcon}
          onClick={() => toggleActiveControl("PaintControl")}
        />
        <IconButton
          option={2}
          isActive={activeControl === "EraseControl"}
          icon={EraserIcon}
          onClick={() => toggleActiveControl("EraseControl")}
        />
        <IconButton
          option={3}
          isActive={activeControl === "FillControl"}
          icon={PaintBucketIcon}
          onClick={() => toggleActiveControl("FillControl")}
        />
        <IconButton
          option={4}
          isActive={isColorPickerBoxOpen}
          icon={PaletteIcon}
          onClick={() => setIsColorPickerBoxOpen(!isColorPickerBoxOpen)}
        />
        <VerticalDivider />
        <IconButton
          isActive={isMenuBoxOpen}
          icon={MenuIcon}
          onClick={() => setIsMenuBoxOpen(!isMenuBoxOpen)}
        />
      </span>

      <div
        className={`w-full mt-4 flex flex-row gap-4 items-start justify-center ${
          !isBoxAreaOpen && "hidden"
        }`}
      >
        <ColorPickerBox
          isActive={isColorPickerBoxOpen}
          setIsFocused={setIsFocused}
        />
        {/* <div className="flex flex-col gap-4"> */}
        <MenuBox
          isActive={isMenuBoxOpen}
          closeMenuBox={() => setIsMenuBoxOpen(false)}
          isDimensionBoxOpen={isDimensionBoxOpen}
          setIsDimensionBoxOpen={setIsDimensionBoxOpen}
        />
        <DimensionBox
          isActive={isDimensionBoxOpen}
          setIsFocused={setIsFocused}
        />
        {/* </div> */}
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
  const { isDragging, setIsDragging } = useControlBarContext();
  const initialPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    setIsDragging(true);
    initialPos.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    initialPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const offsetX: number = e.clientX - initialPos.current.x;
      const offsetY: number = e.clientY - initialPos.current.y;
      onDrag(offsetX, offsetY);
      initialPos.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging) {
      const offsetX: number = e.touches[0].clientX - initialPos.current.x;
      const offsetY: number = e.touches[0].clientY - initialPos.current.y;
      onDrag(offsetX, offsetY);
      initialPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <span
      className="p-2.5 px-0 cursor-grab"
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
    >
      <Icon
        width={14}
        height={22}
        fill={isDragging ? theme.ACTIVE_BLUE_FG : theme.NEUTRAL_GRAY_FG}
      />
    </span>
  );
};

export default ControlBar;
