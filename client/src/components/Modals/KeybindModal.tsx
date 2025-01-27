import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getFriendlyKey } from "../../utils/platformUtils";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import { KeyArray } from "../../utils/constants";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

const BLACKLIST: string[] = [
  "KeyQ",
  "KeyW",
  "KeyE",
  "KeyR",
  "KeyA",
  "KeyS",
  "KeyD",
  "KeyF",
  "KeyZ",
  "Backspace",
  "Enter",
  "Escape",
];

const MODIFIERS: string[] = [
  "MetaLeft",
  "MetaRight",
  "AltLeft",
  "AltRight",
  "ControlLeft",
  "ControlRight",
  "ShiftLeft",
  "ShiftRight",
];

const isAlphaKey = (key: string): boolean => /^[A-Z]$/.test(key);
const isDigitKey = (key: string): boolean => /^\d$/.test(key);
const isPunctuationKey = (key: string): boolean =>
  [",", ".", "/", ";", "'", "[", "]", "\\", "=", "-", "`"].includes(key);

const KeybindModal = () => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();
  const { keybindModalId, menuKeybinds, updateMenuKeybind } =
    useKeybindContext();

  useModalState(isKeybindModalOpen);

  const [activeKeybind, setActiveKeybind] = useState<string>("");
  const [initialKeybind, setInitialKeybind] = useState<string>("");
  const pressedKeys = useRef<Set<string>>(new Set());
  const isAlphanumericInSequence = useRef<{
    hasAlpha: boolean;
    hasDigit: boolean;
    hasPunctuation: boolean;
  }>({
    hasAlpha: false,
    hasDigit: false,
    hasPunctuation: false,
  });

  useEffect(() => {
    if (keybindModalId) {
      const initial: string = menuKeybinds[keybindModalId]?.keybind || "";
      setInitialKeybind(initial);
      setActiveKeybind("");
      pressedKeys.current.clear();
      isAlphanumericInSequence.current = {
        hasAlpha: false,
        hasDigit: false,
        hasPunctuation: false,
      };
    }
  }, [keybindModalId, menuKeybinds]);

  const formatKeybind = (keys: KeyArray): string => {
    const modifiers: KeyArray = [];
    const regularKeys: KeyArray = [];

    keys.forEach((key: string) => {
      if (MODIFIERS.includes(key)) {
        modifiers.push(key);
      } else {
        regularKeys.push(key);
      }
    });

    modifiers.sort((a, b) => MODIFIERS.indexOf(a) - MODIFIERS.indexOf(b));

    const translatedModifiers: string[] = modifiers.map(getFriendlyKey);
    const translatedRegulars: string[] = regularKeys.map(getFriendlyKey);
    return [...translatedModifiers, ...translatedRegulars].join(" + ");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const key: string = e.code;

    if (pressedKeys.current.has(key)) return;

    if (BLACKLIST.includes(key)) {
      alert(`${getFriendlyKey(key)} is a forbidden key.`);
      return;
    }

    if (pressedKeys.current.size === 0) {
      setActiveKeybind("");
      isAlphanumericInSequence.current = {
        hasAlpha: false,
        hasDigit: false,
        hasPunctuation: false,
      };
    }

    const friendlyKey: string = getFriendlyKey(key);

    if (isAlphaKey(friendlyKey)) {
      if (isAlphanumericInSequence.current.hasAlpha) {
        alert("Cannot combine multiple alpha keys.");
        return;
      }
      if (isAlphanumericInSequence.current.hasDigit) {
        alert("Cannot combine alpha keys with digits.");
        return;
      }
      if (isAlphanumericInSequence.current.hasPunctuation) {
        alert("Cannot combine alpha keys with punctuation.");
        return;
      }
      isAlphanumericInSequence.current.hasAlpha = true;
    }

    if (isDigitKey(friendlyKey)) {
      if (isAlphanumericInSequence.current.hasAlpha) {
        alert("Cannot combine digits with alpha keys.");
        return;
      }
      if (isAlphanumericInSequence.current.hasDigit) {
        alert("Cannot combine multiple digit keys.");
        return;
      }
      if (isAlphanumericInSequence.current.hasPunctuation) {
        alert("Cannot combine digits with punctuation.");
        return;
      }
      isAlphanumericInSequence.current.hasDigit = true;
    }

    if (isPunctuationKey(friendlyKey)) {
      if (
        isAlphanumericInSequence.current.hasAlpha ||
        isAlphanumericInSequence.current.hasDigit
      ) {
        alert("Cannot combine punctuation with alphanumeric keys.");
        return;
      }
      if (isAlphanumericInSequence.current.hasPunctuation) {
        alert("Cannot combine multiple punctuation keys.");
        return;
      }
      isAlphanumericInSequence.current.hasPunctuation = true;
    }

    pressedKeys.current.add(key);

    setActiveKeybind((prev) => {
      const keys: Set<string> = new Set<string>(prev ? prev.split(" + ") : []);
      keys.add(key);
      return formatKeybind(Array.from(keys));
    });
  };

  const handleKeyUp = () => {
    pressedKeys.current.clear();
  };

  const handleSave = (): void => {
    if (!activeKeybind) {
      alert("Keybind cannot be empty.");
      return;
    }

    updateMenuKeybind(activeKeybind);
    setIsKeybindModalOpen(false);
  };

  const handleFocus = (): void => {
    setActiveKeybind("");
    pressedKeys.current.clear();
    isAlphanumericInSequence.current = {
      hasAlpha: false,
      hasDigit: false,
      hasPunctuation: false,
    };
  };

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
              Your current <u>{keybindModalId}</u> keybind is:{" "}
              <em>{initialKeybind}</em>
            </p>
            <input
              type="text"
              placeholder="Press a key combination"
              autoFocus={true}
              value={activeKeybind}
              readOnly={true}
              onFocus={handleFocus}
              className="border-solid border-2 rounded-md p-2 w-full mb-6 outline-2 focus:outline-blue-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
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
