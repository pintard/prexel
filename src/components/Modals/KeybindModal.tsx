import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getFriendlyKey, getOperatingSystem } from "../../utils/platformUtils";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import {
  DEFAULT_KEY_MAP,
  KeyArray,
  MAC_KEY_MAP,
  StringHash,
} from "../../utils/constants";

const KeybindModal = () => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();
  const { keybindModalId, menuKeybinds, updateMenuKeybind } =
    useKeybindContext();

  const [activeKeybind, setActiveKeybind] = useState("");
  const [initialKeybind, setInitialKeybind] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (keybindModalId) {
      const initial: string = menuKeybinds[keybindModalId]?.keybind || "";
      setInitialKeybind(initial);
      setActiveKeybind("");
    }
  }, [keybindModalId, menuKeybinds]);

  const formatKeybind = (keys: KeyArray): string => {
    const modifiers: KeyArray = [];
    const regularKeys: KeyArray = [];
    keys.forEach((key: string) => {
      if (key === "ctrl" || key === "alt" || key === "shift" || key === "cmd") {
        modifiers.push(key);
      } else {
        regularKeys.push(key);
      }
    });
    return [...modifiers, ...regularKeys].join(" + ");
  };
  const handleFocus = (): void => {
    setActiveKeybind("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const keyMap: StringHash =
      getOperatingSystem() === "Mac" ? MAC_KEY_MAP : DEFAULT_KEY_MAP;
    const friendlyKey: string = getFriendlyKey(e.code);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (keyMap[e.code] || (!keyMap[e.code] && e.code.startsWith("Key"))) {
      setActiveKeybind((prev) => {
        const keys = new Set<string>(prev ? prev.split(" + ") : []);
        keys.add(friendlyKey);
        console.log("keys", keys);
        return formatKeybind(Array.from(keys));
      });
    }
  };

  const handleSave = (): void => {
    updateMenuKeybind(activeKeybind);
    setIsKeybindModalOpen(false);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveKeybind("");
      console.log("Keybind reset due to inactivity.");
    }, 3000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [activeKeybind]);

  if (isKeybindModalOpen && keybindModalId) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Set a new keybind</h2>
          <p className="mb-4">Your current keybind is: {initialKeybind}</p>
          <input
            type="text"
            autoFocus={true}
            value={activeKeybind}
            readOnly={true}
            onFocus={handleFocus}
            onClick={handleFocus}
            className="bg-white border-solid border-2 rounded-md p-2 w-full mb-6 outline-2 focus:outline-blue-400"
            onKeyDown={handleKeyDown}
          />
          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={() => setIsKeybindModalOpen(false)}
            >
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default KeybindModal;
