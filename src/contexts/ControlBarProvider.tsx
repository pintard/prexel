import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useRef,
  useMemo,
  useEffect,
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
  isStrokeActive: false,
  setIsStrokeActive: (() => {}) as Dispatch<SetStateAction<boolean>>,
  historyIndex: 0,
  setHistoryIndex: (() => {}) as Dispatch<SetStateAction<number>>,
  colorHistory: {} as ColorHistory,
  updateColors: (() => {}) as (
    id: string | StringHash,
    color?: string | undefined
  ) => void,
  updateHistory: (() => {}) as (cellColors: StringHash) => void,
});

interface ControlBarProviderProps {
  children: ReactNode;
}

const ControlBarProvider = ({ children }: ControlBarProviderProps) => {
  const DEFAULT_ROWS: number = 12;
  const DEFAULT_COLS: number = 40;
  const DEFAULT_COLOR: string = "#ff0000";

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

  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [rows, setRows] = useState<number>(DEFAULT_ROWS);
  const [cols, setCols] = useState<number>(DEFAULT_COLS);
  const [activeControl, setActiveControl] = useState<ActiveControl | null>(
    null
  );
  const [swatchColors, setSwatchColors] = useState<StringHash>({});
  const [cellColors, setCellColors] = useState<StringHash>({});
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isStrokeActive, setIsStrokeActive] = useState<boolean>(false);

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const colorHistory = useRef<ColorHistory>([{}]);

  useEffect(() => {
    console.log("Colors:", cellColors);

    if (!isStrokeActive) {
      updateHistory(cellColors);
    }
  }, [cellColors]);

  const updateColors = (
    idOrColors: string | StringHash,
    color?: string | undefined
  ): void => {
    setCellColors((oldCellColors) => {
      return typeof idOrColors === "string"
        ? { ...oldCellColors, [idOrColors]: color }
        : idOrColors;
    });
  };

  const updateHistory = (newCellColors: StringHash) => {
    const newColorHistory: ColorHistory = colorHistory.current.slice(
      0,
      historyIndex + 1
    );
    newColorHistory.push(newCellColors);

    if (newColorHistory.length > 20) {
      newColorHistory.shift();
    }

    colorHistory.current = newColorHistory;
    setHistoryIndex(newColorHistory.length - 1);
  };

  const value = useMemo(
    () => ({
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
      isStrokeActive,
      setIsStrokeActive,
      historyIndex,
      setHistoryIndex,
      colorHistory: colorHistory.current,
      updateColors,
      updateHistory,
    }),
    [
      swatchHotKeys,
      color,
      rows,
      cols,
      activeControl,
      swatchColors,
      cellColors,
      isClearModalOpen,
      isSaveModalOpen,
      isUploadModalOpen,
      isDragging,
      isStrokeActive,
      historyIndex,
      colorHistory.current,
    ]
  );

  return (
    <ControlBarContext.Provider value={value}>
      {children}
    </ControlBarContext.Provider>
  );
};

export default ControlBarProvider;
