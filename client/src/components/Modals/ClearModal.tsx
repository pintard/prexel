import React from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

const ClearModal = () => {
  const { updateColors, isClearModalOpen, setIsClearModalOpen } =
    useControlBarContext();

  useModalState(isClearModalOpen);

  const handleClear = () => {
    updateColors({});
    setIsClearModalOpen(false);
  };

  if (isClearModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 dark:bg-black dark:bg-opacity-60 z-30 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4 text-gray-900 dark:text-gray-400">
              Clear artboard?
            </h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-5">
              You will <b>not</b> be able to retrieve your previous work
            </p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-inherit text-green-600 dark:text-green-400 rounded-full border border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-950 transition-colors"
                onClick={() => setIsClearModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-950 transition-colors"
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ClearModal;
