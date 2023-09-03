import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
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
});

type ModifierKey = "\u2325" | "alt";

interface KeybindProviderProps {
  children: ReactNode;
}

const KeybindProvider = ({ children }: KeybindProviderProps) => {
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

  const [menuKeybinds, setMenuKeybinds] = useLocalStorage<KeybindMap>(
    "menu-keybinds",
    DEFAULT_MENU_KEYBINDS
  );

  const value = useMemo(
    () => ({
      menuKeybinds,
      setMenuKeybinds,
    }),
    [menuKeybinds]
  );

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  );
};

export default KeybindProvider;
