import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface StringHash {
  [key: string]: string | undefined;
}

export const ControlBarContext = createContext({
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
  cellColors: {} as StringHash | null,
  setCellColors: (() => {}) as Dispatch<SetStateAction<StringHash | null>>,
});

interface ControlBarProviderProps {
  children: ReactNode;
}

type ActiveControl =
  | "DimensionControl"
  | "ColorPickControl"
  | "PaintControl"
  | "FillControl"
  | "EraseControl";

const ControlBarProvider = ({ children }: ControlBarProviderProps) => {
  const [color, setColor] = useState<string>("#ff0000");
  const [rows, setRows] = useState<number>(12);
  const [cols, setCols] = useState<number>(40);
  const [activeControl, setActiveControl] = useState<ActiveControl | null>(
    null
  );
  const [swatchColors, setSwatchColors] = useState<StringHash>({});
  const [cellColors, setCellColors] = useState<StringHash | null>({});

  return (
    <ControlBarContext.Provider
      value={{
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
      }}
    >
      {children}
    </ControlBarContext.Provider>
  );
};

export default ControlBarProvider;
