import React, { useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { StringHash } from "../../utils/constants";
import { getOperatingSystem } from "../../utils/platformUtils";

const MAC_KEY_MAP: StringHash = {
  MetaLeft: "\u2318",
  MetaRight: "\u2318",
  AltLeft: "\u2325",
  AltRight: "\u2325",
  ControlLeft: "\u2303",
  ControlRight: "\u2303",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

const DEFAULT_KEY_MAP: StringHash = {
  MetaLeft: "cmd",
  MetaRight: "cmd",
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

interface KeybindModalProps {
  currentKeybind: string;
  onSave: (newKeybind: string) => void;
}

const KeybindModal = ({ currentKeybind, onSave }: KeybindModalProps) => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();

  const [newKeybind, setNewKeybind] = useState<string>(currentKeybind);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const getFriendlyKey = (code: string): string => {
    const friendlyKey: string | undefined =
      getOperatingSystem() === "Mac"
        ? MAC_KEY_MAP[code]
        : DEFAULT_KEY_MAP[code];

    if (code.startsWith("Key")) {
      return code.charAt(3);
    }

    return friendlyKey || code;
  };

  const handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const validKeys: string[] =
      getOperatingSystem() === "Mac"
        ? Object.keys(MAC_KEY_MAP)
        : Object.keys(DEFAULT_KEY_MAP);

    if (
      validKeys.includes(e.code) ||
      (e.code.startsWith("Key") && e.code.length === 4)
    ) {
      setPressedKeys((prevKeys: Set<string>) => {
        const newKeys: Set<string> = new Set(prevKeys);
        newKeys.add(e.code);
        setNewKeybind(Array.from(newKeys).map(getFriendlyKey).join(" + "));
        return newKeys;
      });
    }
  };

  const handleKeyup = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setPressedKeys((prevKeys: Set<string>) => {
        const newKeys: Set<string> = new Set(prevKeys);
        setNewKeybind(Array.from(newKeys).map(getFriendlyKey).join(" + "));
        newKeys.delete(e.code);
        return newKeys;
      });
    }, 50);
  };

  if (isKeybindModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Set a new keybind</h2>
          <p className="mb-4">Your current keybind is: {currentKeybind}</p>
          <input
            type="text"
            autoFocus={true}
            value={newKeybind}
            onChange={(e) => setNewKeybind(e.target.value)}
            className="bg-white border-solid border-2 rounded-md p-2 w-full mb-6 outline-2 focus:outline-blue-400"
            onKeyDown={handleKeydown}
            onKeyUp={handleKeyup}
          />
          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={() => onSave(newKeybind)}
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
