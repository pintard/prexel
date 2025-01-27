import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFriendlyKey, getOperatingSystem } from "../utils/platformUtils";
import useLocalStorage from "../hooks/useLocalStorage";
import { swatchHotKeys } from "./ControlBarProvider";

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
  onKeybindTriggered: (() => {}) as (
    callback: (action: string) => void
  ) => void,
  triggeredAction: "",
});

type ModifierKey = "\u2318" | "ctrl";
type SecondaryModifierKey = "\u2325" | "alt";

const modifierKey: ModifierKey =
  getOperatingSystem() === "Mac" ? "\u2318" : "ctrl";

const secondaryModifierKey: SecondaryModifierKey =
  getOperatingSystem() === "Mac" ? "\u2325" : "alt";

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
    keybind: `${modifierKey} + ${secondaryModifierKey} + C`,
  },
  save: {
    keybind: `${modifierKey} + S`,
  },
  darkLightToggle: {
    keybind: `${modifierKey} + D`,
  },
  undo: {
    keybind: `${modifierKey} + Z`,
  },
  redo: {
    keybind: `${modifierKey} + shift + Z`,
  },
  escape: {
    keybind: "Escape",
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
  const [triggeredAction, setTriggeredAction] = useState<string>("");

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

  useEffect(() => {
    const swatchKeybinds: KeybindMap = swatchHotKeys.reduce((acc, key) => {
      acc[`swatch${key.toUpperCase()}`] = { keybind: key };
      return acc;
    }, {} as KeybindMap);

    setMenuKeybinds((prev) => ({ ...prev, ...swatchKeybinds }));
  }, []);

  const isKeybindMatch = (keybind: string, event: KeyboardEvent) => {
    const keys: string[] = keybind.split(" + ");
    const modifiers: string[] = keys.filter((key) =>
      [
        "super",
        "win",
        "ctrl",
        "alt",
        "shift",
        "\u2318",
        "\u2325",
        "\u2303",
      ].includes(key)
    );
    const regularKeys: string[] = keys.filter(
      (key: string) => !modifiers.includes(key)
    );

    const isModifierMatch: boolean = modifiers.every((key) => {
      return (
        ((key === "\u2318" || key === "super" || key === "win") &&
          event.metaKey) ||
        ((key === "\u2325" || key === "alt") && event.altKey) ||
        ((key === "\u2303" || key === "ctrl") && event.ctrlKey) ||
        (key === "shift" && event.shiftKey)
      );
    });

    const isRegularKeyMatch: boolean = regularKeys.some((key) => {
      return getFriendlyKey(event.code).toLowerCase() === key.toLowerCase();
    });

    return isModifierMatch && isRegularKeyMatch;
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      Object.keys(menuKeybinds).forEach((action: string) => {
        const keybind: string = menuKeybinds[action].keybind;

        if (isKeybindMatch(keybind, event)) {
          console.log(`Keybind triggered: ${action}`);
          event.preventDefault();
          setTriggeredAction(action);
        }
      });
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [menuKeybinds]);

  const onKeybindTriggered = (callback: (action: string) => void) => {
    if (triggeredAction) {
      callback(triggeredAction);
      setTriggeredAction("");
    }
  };

  const value = useMemo(
    () => ({
      menuKeybinds,
      setMenuKeybinds,
      keybindModalId,
      setKeybindModalId,
      updateMenuKeybind,
      resetKeybinds,
      onKeybindTriggered,
      triggeredAction,
    }),
    [menuKeybinds, keybindModalId, triggeredAction]
  );

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  );
};

export default KeybindProvider;
