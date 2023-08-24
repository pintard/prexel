import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

export const ColorPickerBoxContext = createContext({
  isDragging: false,
  setIsDragging: (() => {}) as Dispatch<SetStateAction<boolean>>,
});

interface ColorPickerBoxProviderProps {
  children: ReactNode;
}

const ColorPickerBoxProvider = ({ children }: ColorPickerBoxProviderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      isDragging,
      setIsDragging,
    }),
    [isDragging]
  );

  return (
    <ColorPickerBoxContext.Provider value={value}>
      {children}
    </ColorPickerBoxContext.Provider>
  );
};

export default ColorPickerBoxProvider;
