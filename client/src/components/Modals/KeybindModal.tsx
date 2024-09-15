import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getFriendlyKey, getKeyMap } from "../../utils/platformUtils";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import { KeyArray, StringHash } from "../../utils/constants";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

const KeybindModal = () => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();
  const { keybindModalId, menuKeybinds, updateMenuKeybind } =
    useKeybindContext();

  useModalState(isKeybindModalOpen);

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
      if (
        [
          "MetaLeft",
          "MetaRight",
          "AltLeft",
          "AltRight",
          "ControlLeft",
          "ControlRight",
          "ShiftLeft",
          "ShiftRight",
        ].includes(key)
      ) {
        modifiers.push(key);
      } else {
        regularKeys.push(key);
      }
    });

    const modifierOrder: string[] = [
      "MetaLeft",
      "MetaRight",
      "AltLeft",
      "AltRight",
      "ControlLeft",
      "ControlRight",
      "ShiftLeft",
      "ShiftRight",
    ];

    console.log("modifiers", modifiers, "regularKeys", regularKeys);

    modifiers.sort((a: string, b: string) => {
      console.log("trigger");
      return modifierOrder.indexOf(a) - modifierOrder.indexOf(b);
    });

    const translatedModifiers: string[] = modifiers.map(getFriendlyKey);
    const translatedRegulars: string[] = regularKeys.map(getFriendlyKey);

    const result: string = [...translatedModifiers, ...translatedRegulars].join(
      " + "
    );
    return result;
  };

  const handleFocus = (): void => {
    setActiveKeybind("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const keyMap: StringHash = getKeyMap();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (keyMap[e.code] || (!keyMap[e.code] && e.code.startsWith("Key"))) {
      setActiveKeybind((prev) => {
        const keys: Set<string> = new Set<string>(
          prev ? prev.split(" + ") : []
        );

        keys.add(e.code);

        const formattedKeybind: string = formatKeybind(Array.from(keys));
        return formattedKeybind;
      });
    }
  };

  const handleSave = (): void => {
    if (!activeKeybind) {
      alert("Keybind cannot be empty.");
      return;
    }

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
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4 text-gray-900 dark:text-gray-400">
              Set a new keybind
            </h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-5">
              Your current{" "}
              <em>
                <b>{keybindModalId}</b>
              </em>{" "}
              keybind is: <b>{initialKeybind}</b>
            </p>
            <input
              type="text"
              placeholder="Press a key combination"
              autoFocus={true}
              value={activeKeybind}
              readOnly={true}
              onFocus={handleFocus}
              onClick={handleFocus}
              className="border-solid border-2 rounded-md p-2 w-full mb-6 outline-2 focus:outline-blue-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
              onKeyDown={handleKeyDown}
            />
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-inherit text-green-600 dark:text-green-400 rounded-full border border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-950 transition-colors"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-950 transition-colors"
                onClick={() => setIsKeybindModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default KeybindModal;
