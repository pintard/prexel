import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
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
  resetKeybinds: (() => {}) as () => void,
});

type ModifierKey = "\u2318" | "ctrl";

const modifierKey: ModifierKey =
  getOperatingSystem() === "Mac" ? "\u2318" : "ctrl";

const DEFAULT_MENU_KEYBINDS: KeybindMap = {
  reset: {
    keybind: `${modifierKey} + shift + R`,
  },
  paint: {
    keybind: "1",
  },
  erase: {
    keybind: "2",
  },
  fill: {
    keybind: "3",
  },
  picker: {
    keybind: "4",
  },
  menu: {
    keybind: "/",
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
    if (!newKeybind) {
      console.error("Cannot update keybind with an empty value.");
      return;
    }

    setMenuKeybinds((prevMenuKeybinds: KeybindMap) => ({
      ...prevMenuKeybinds,
      [keybindModalId]: {
        keybind: newKeybind,
      },
    }));
  };

  const resetKeybinds = () => {
    setMenuKeybinds(DEFAULT_MENU_KEYBINDS);
  };

  const value = useMemo(
    () => ({
      menuKeybinds,
      setMenuKeybinds,
      keybindModalId,
      setKeybindModalId,
      updateMenuKeybind,
      resetKeybinds,
    }),
    [menuKeybinds, keybindModalId]
  );

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  );
};

export default KeybindProvider;
