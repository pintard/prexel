import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { StringHash } from "../utils/constants";

export type ActiveControl = "PaintControl" | "FillControl" | "EraseControl";

type ColorHistory = StringHash[];

export const ControlBarContext = createContext({
  swatchHotKeys: [""],
  color: "",
  setColor: (() => {}) as Dispatch<SetStateAction<string>>,
  rows: 0,
  setRows: (() => {}) as Dispatch<SetStateAction<number>>,
  cols: 0,
  setCols: (() => {}) as Dispatch<SetStateAction<number>>,
  activeControl: null as ActiveControl | null,
  setActiveControl: (() => {}) as Dispatch<
    SetStateAction<ActiveControl | null>
  >,
  swatchColors: {} as StringHash,
  setSwatchColors: (() => {}) as Dispatch<SetStateAction<StringHash>>,
  cellColors: {} as StringHash,
  setCellColors: (() => {}) as Dispatch<SetStateAction<StringHash>>,
  isClearModalOpen: false,
  setIsClearModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isSaveModalOpen: false,
  setIsSaveModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isUploadModalOpen: false,
  setIsUploadModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isDragging: false,
  setIsDragging: (() => {}) as Dispatch<SetStateAction<boolean>>,
  historyIndex: 0,
  setHistoryIndex: (() => {}) as Dispatch<SetStateAction<number>>,
  colorHistory: {} as ColorHistory,
  updateColors: (() => {}) as (
    id: string | StringHash,
    color?: string | undefined
  ) => void,
});

interface ControlBarProviderProps {
  children: ReactNode;
}

const ControlBarProvider = ({ children }: ControlBarProviderProps) => {
  const swatchHotKeys: string[] = new Array<string>(
    "q",
    "w",
    "e",
    "r",
    "a",
    "s",
    "d",
    "f"
  );
  const [color, setColor] = useState<string>("#ff0000");
  const [rows, setRows] = useState<number>(12);
  const [cols, setCols] = useState<number>(40);
  const [activeControl, setActiveControl] = useState<ActiveControl | null>(
    null
  );
  const [swatchColors, setSwatchColors] = useState<StringHash>({});
  const [cellColors, setCellColors] = useState<StringHash>({});
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const colorHistory = useRef<ColorHistory>([{}]);

  const updateColors = (
    idOrColors: string | StringHash,
    color?: string | undefined
  ): void => {
    setCellColors((oldCellColors) => {
      const newCellColors =
        typeof idOrColors === "string"
          ? { ...oldCellColors, [idOrColors]: color }
          : idOrColors;

      colorHistory.current = colorHistory.current.slice(0, historyIndex + 1);
      colorHistory.current.push(newCellColors);
      setHistoryIndex(colorHistory.current.length - 1);
      return newCellColors;
    });
  };

  return (
    <ControlBarContext.Provider
      value={{
        swatchHotKeys,
        color,
        setColor,
        rows,
        setRows,
        cols,
        setCols,
        activeControl,
        setActiveControl,
        swatchColors,
        setSwatchColors,
        cellColors,
        setCellColors,
        isClearModalOpen,
        setIsClearModalOpen,
        isSaveModalOpen,
        setIsSaveModalOpen,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isDragging,
        setIsDragging,
        historyIndex,
        setHistoryIndex,
        colorHistory: colorHistory.current,
        updateColors,
      }}
    >
      {children}
    </ControlBarContext.Provider>
  );
};

export default ControlBarProvider;
