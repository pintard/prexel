import React from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";

interface ClearModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const SaveModal = ({ isOpen, closeModal }: ClearModalProps) => {
  const { cellColors } = useControlBarContext();

  const handleSave = () => {

  };

  const prexelCode = "This is where your generated code will appear.";

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Save this prexel?</h2>
          <p className="mb-4">{prexelCode}</p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
            onClick={handleSave}
          >
            Copy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SaveModal;
