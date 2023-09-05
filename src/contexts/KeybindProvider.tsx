import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOperatingSystem } from "../utils/platformUtils";
import useLocalStorage from "../hooks/useLocalStorage";

export interface KeybindMap {
  [label: string]: {
    keybind: string;
  };
}

export const KeybindContext = createContext({
  menuKeybinds: {} as KeybindMap,
  setMenuKeybinds: (() => {}) as Dispatch<SetStateAction<KeybindMap>>,
  keybindModalId: "",
  setKeybindModalId: (() => {}) as Dispatch<SetStateAction<string>>,
  updateMenuKeybind: (() => {}) as (newKeybind: string) => void,
});

type ModifierKey = "\u2325" | "alt";

const modifierKey: ModifierKey =
  getOperatingSystem() === "Mac" ? "\u2325" : "alt";

const DEFAULT_MENU_KEYBINDS: KeybindMap = {
  reset: {
    keybind: `${modifierKey} + shift + R`,
  },
  resize: {
    keybind: `${modifierKey} + R`,
  },
  clear: {
    keybind: `${modifierKey} + shift + C`,
  },
  save: {
    keybind: `${modifierKey} + S`,
  },
  darkLightToggle: {
    keybind: `${modifierKey} + D`,
  },
  minimize: {
    keybind: `${modifierKey} + M`,
  },
};

interface KeybindProviderProps {
  children: ReactNode;
}

const KeybindProvider = ({ children }: KeybindProviderProps) => {
  const [menuKeybinds, setMenuKeybinds] = useLocalStorage<KeybindMap>(
    "menu-keybinds",
    DEFAULT_MENU_KEYBINDS
  );
  const [keybindModalId, setKeybindModalId] = useState<string>("");

  const updateMenuKeybind = (newKeybind: string) => {
    setMenuKeybinds((prevMenuKeybinds: KeybindMap) => ({
      ...prevMenuKeybinds,
      [keybindModalId]: {
        keybind: newKeybind,
      },
    }));
  };

  const value = useMemo(
    () => ({
      menuKeybinds,
      setMenuKeybinds,
      keybindModalId,
      setKeybindModalId,
      updateMenuKeybind,
    }),
    [menuKeybinds, keybindModalId]
  );

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  );
};

export default KeybindProvider;
