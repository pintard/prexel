import React from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface ClearModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ClearModal = ({ isOpen, closeModal }: ClearModalProps) => {
  const { setCellColors, cellColors } = useControlBarContext();

  const handleClear = () => {
    setCellColors(null); // TODO HOW TO CLEAR?
    closeModal();
  };

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Clear artboard?</h2>
          <p className="text-gray-600 mb-4">
            You cannot retrieve your previous work!
          </p>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 mr-4"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={closeModal}
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
