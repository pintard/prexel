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
import { StringHash as ColorGroup } from "../utils/constants";
import useLocalStorage from "../hooks/useLocalStorage";
import { getCuteCode } from "../utils/generateUtils";

export type ActiveControl = "PaintControl" | "FillControl" | "EraseControl";

type ColorHistory = ColorGroup[];

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
  swatchColors: {} as ColorGroup,
  setSwatchColors: (() => {}) as Dispatch<SetStateAction<ColorGroup>>,
  cellColors: {} as ColorGroup,
  setCellColors: (() => {}) as Dispatch<SetStateAction<ColorGroup>>,
  cuteCode: "",
  setCuteCode: (() => {}) as Dispatch<SetStateAction<string>>,
  isAnyModalOpen: false,
  setIsAnyModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isClearModalOpen: false,
  setIsClearModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isSaveModalOpen: false,
  setIsSaveModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isUploadModalOpen: false,
  setIsUploadModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isKeybindModalOpen: false,
  setIsKeybindModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isPublishModalOpen: false,
  setIsPublishModalOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isDragging: false,
  setIsDragging: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isStrokeActive: false,
  setIsStrokeActive: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isMenuBoxOpen: false,
  setIsMenuBoxOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isKeybindBoxOpen: false,
  setIsKeybindBoxOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isDimensionBoxOpen: false,
  setIsDimensionBoxOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isColorPickerBoxOpen: false,
  setIsColorPickerBoxOpen: (() => {}) as Dispatch<SetStateAction<boolean>>,
  isInputFocused: false,
  setIsInputFocused: (() => {}) as Dispatch<SetStateAction<boolean>>,
  historyIndex: 0,
  setHistoryIndex: (() => {}) as Dispatch<SetStateAction<number>>,
  colorHistory: {} as ColorHistory,
  updateColors: (() => {}) as (
    id: string | ColorGroup,
    color?: string | undefined
  ) => void,
  updateHistory: (() => {}) as (cellColors: ColorGroup) => void,
});

interface ControlBarProviderProps {
  children: ReactNode;
}

export const swatchHotKeys: string[] = new Array<string>(
  "q",
  "w",
  "e",
  "r",
  "a",
  "s",
  "d",
  "f"
);

const ControlBarProvider = ({ children }: ControlBarProviderProps) => {
  const DEFAULT_ROWS: number = 12;
  const DEFAULT_COLS: number = 40;
  const DEFAULT_COLOR: string = "#ff0000";

  const [color, setColor] = useState<string>(DEFAULT_COLOR);
  const [rows, setRows] = useLocalStorage<number>(
    "artboard-rows",
    DEFAULT_ROWS
  );
  const [cols, setCols] = useLocalStorage<number>(
    "artboard-cols",
    DEFAULT_COLS
  );
  const [activeControl, setActiveControl] = useState<ActiveControl | null>(
    null
  );
  const [swatchColors, setSwatchColors] = useLocalStorage<ColorGroup>(
    "swatch-map",
    {}
  );
  const [cellColors, setCellColors] = useState<ColorGroup>({});
  const [cuteCode, setCuteCode] = useState<string>("");
  const [isAnyModalOpen, setIsAnyModalOpen] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isKeybindModalOpen, setIsKeybindModalOpen] = useState<boolean>(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isStrokeActive, setIsStrokeActive] = useState<boolean>(false);

  const [isMenuBoxOpen, setIsMenuBoxOpen] = useState<boolean>(false);
  const [isKeybindBoxOpen, setIsKeybindBoxOpen] = useState<boolean>(false);
  const [isDimensionBoxOpen, setIsDimensionBoxOpen] = useState<boolean>(false);
  const [isColorPickerBoxOpen, setIsColorPickerBoxOpen] =
    useState<boolean>(false);

  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const colorHistory = useRef<ColorHistory>([]);

  useEffect(() => {
    setCuteCode(getCuteCode(cellColors, rows, cols));
  }, [cellColors, rows, cols]);

  useEffect(() => {
    // TODO diffrentiate from click, double trigger
    if (!isStrokeActive) {
      updateHistory(cellColors);
    }
  }, [cellColors, isStrokeActive]);

  const updateColors = (
    idOrColors: string | ColorGroup,
    color?: string | undefined
  ): void => {
    setCellColors((oldCellColors: ColorGroup) => {
      const newColors =
        typeof idOrColors === "string"
          ? { ...oldCellColors, [idOrColors]: color }
          : idOrColors;
      return newColors;
    });
  };

  const updateHistory = (newCellColors: ColorGroup) => {
    const newColorHistory: ColorHistory = colorHistory.current.slice(
      0,
      historyIndex + 1
    );

    if (
      JSON.stringify(newColorHistory[newColorHistory.length - 1]) !==
      JSON.stringify(newCellColors)
    ) {
      newColorHistory.push(newCellColors);

      if (newColorHistory.length > 20) {
        newColorHistory.shift();
      }

      colorHistory.current = newColorHistory;
      setHistoryIndex(newColorHistory.length - 1);
    }
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
      cuteCode,
      setCuteCode,
      isAnyModalOpen,
      setIsAnyModalOpen,
      isClearModalOpen,
      setIsClearModalOpen,
      isSaveModalOpen,
      setIsSaveModalOpen,
      isUploadModalOpen,
      setIsUploadModalOpen,
      isKeybindModalOpen,
      setIsKeybindModalOpen,
      isPublishModalOpen,
      setIsPublishModalOpen,
      isDragging,
      setIsDragging,
      isStrokeActive,
      setIsStrokeActive,
      isMenuBoxOpen,
      setIsMenuBoxOpen,
      isKeybindBoxOpen,
      setIsKeybindBoxOpen,
      isDimensionBoxOpen,
      setIsDimensionBoxOpen,
      isColorPickerBoxOpen,
      setIsColorPickerBoxOpen,
      isInputFocused,
      setIsInputFocused,
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
      cuteCode,
      isAnyModalOpen,
      isClearModalOpen,
      isSaveModalOpen,
      isUploadModalOpen,
      isKeybindModalOpen,
      isPublishModalOpen,
      isDragging,
      isStrokeActive,
      isMenuBoxOpen,
      isKeybindBoxOpen,
      isDimensionBoxOpen,
      isColorPickerBoxOpen,
      isInputFocused,
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
