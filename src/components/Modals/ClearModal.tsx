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
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-2xl">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4">Clear artboard?</h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 text-lg mb-5">
              You will <b>not</b> be able to retrieve your previous work
            </p>
            <button
              className="px-4 py-2 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 mr-3 outline outline-1 focus:bg-green-50"
              onClick={() => setIsClearModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 outline outline-2 focus:outline-blue-300"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ClearModal;
