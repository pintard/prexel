import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
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

  return (
    <ColorPickerBoxContext.Provider
      value={{
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </ColorPickerBoxContext.Provider>
  );
};

export default ColorPickerBoxProvider;
