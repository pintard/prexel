import React, { useEffect, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getFriendlyKey, getOperatingSystem } from "../../utils/platformUtils";
import { useKeybindContext } from "../../hooks/useKeybindContext";
import { DEFAULT_KEY_MAP, MAC_KEY_MAP } from "../../utils/constants";

const KeybindModal = () => {
  const { isKeybindModalOpen, setIsKeybindModalOpen } = useControlBarContext();
  const { keybindModalId, menuKeybinds, updateMenuKeybind } =
    useKeybindContext();

  const [activeKeybind, setActiveKeybind] = useState("");
  const [initialKeybind, setInitialKeybind] = useState("");

  useEffect(() => {
    if (keybindModalId) {
      setInitialKeybind(menuKeybinds[keybindModalId]?.keybind || "");
      setActiveKeybind(initialKeybind);
    }
  }, [keybindModalId, menuKeybinds]);

  const handleFocus = () => {
    setActiveKeybind("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const keyMap =
      getOperatingSystem() === "Mac" ? MAC_KEY_MAP : DEFAULT_KEY_MAP;
    const friendlyKey = getFriendlyKey(e.code);

    if (keyMap[e.code] || (!keyMap[e.code] && e.code.startsWith("Key"))) {
      setActiveKeybind((prev) => {
        const keys = new Set(prev ? prev.split(" + ") : []);
        keys.add(friendlyKey);

        console.log("keys", keys);

        return Array.from(keys).join(" + ");
      });
    }
  };

  const handleSave = () => {
    updateMenuKeybind(activeKeybind);
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
