import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getFriendlyKey, getOperatingSystem } from "../../utils/platformUtils";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import { DEFAULT_KEY_MAP, MAC_KEY_MAP } from "../../utils/constants";

const KeybindModal = () => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();
  const { keybindModalId, menuKeybinds, updateMenuKeybind } =
    useKeybindContext();

  const [initialKeybind, setInitialKeybind] = useState<string>("");
  const [newKeybind, setNewKeybind] = useState<string>("");
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    setInitialKeybind(menuKeybinds[keybindModalId]?.keybind || "");
  }, [keybindModalId]);

  useEffect(() => {
    setNewKeybind(initialKeybind);
  }, [initialKeybind]);

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

  const handleSave = () => {
    updateMenuKeybind(newKeybind);
    setIsKeybindModalOpen(false);
  };

  if (isKeybindModalOpen && keybindModalId) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Set a new keybind</h2>
          <p className="mb-4">Your current keybind is: {initialKeybind}</p>
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
