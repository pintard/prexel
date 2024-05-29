import { useEffect, useRef } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { useColorPickerBoxContext } from "../hooks/useColorPickerBoxContext";

interface MousePosition {
  x: number;
  y: number;
}

type DragHandleContext =
  | typeof useControlBarContext
  | typeof useColorPickerBoxContext;

interface DragHandleProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onDrag: (offsetX: number, offsetY: number) => void;
  className?: string;
  width: number;
  height: number;
  useDragContext: DragHandleContext;
}

const DragHandle = ({
  icon: Icon,
  onDrag,
  width,
  height,
  useDragContext,
  ...props
}: DragHandleProps) => {
  const { isDragging, setIsDragging } = useDragContext();
  const initialPos = useRef<MousePosition>({ x: 0, y: 0 });

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
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleMouseUp}
      {...props}
    >
      <Icon
        width={width}
        height={height}
        className={`fill-current ${
          isDragging ? "text-blue-400" : "text-neutral-gray"
        } dark:text-neutral-500`}
      />
    </span>
  );
};

export default DragHandle;
