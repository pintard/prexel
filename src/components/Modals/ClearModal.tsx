import React from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";

const ClearModal = () => {
  const { updateColors, isClearModalOpen, setIsClearModalOpen } =
    useControlBarContext();

  const handleClear = () => {
    updateColors({});
    setIsClearModalOpen(false);
  };

  if (isClearModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Clear artboard?</h2>
          <p className="text-gray-600 mb-4">
            You cannot retrieve your previous work!
          </p>
          <button
            autoFocus={true}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-4 outline outline-2 focus:outline-blue-400"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 outline outline-2 focus:outline-blue-400"
            onClick={() => setIsClearModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default ClearModal;
