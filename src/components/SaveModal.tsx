import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../hooks/useControlBarContext";
import { getCuteCode } from "../utils/generateUtils";

interface ClearModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const SaveModal = ({ isOpen, closeModal }: ClearModalProps) => {
  const { cellColors, rows, cols } = useControlBarContext();
  const [cuteCode, setCuteCode] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCuteCode(getCuteCode(cellColors, rows, cols));
  }, [cellColors, rows, cols]);

  const copyToClipboard = () => {};

  const saveToFile = () => {
    console.log("cuteCode", cuteCode);
    console.log("decodedCuteCode", atob(cuteCode));
  };

  const handleTextAreaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Save this prexel?</h2>
          <p className="mb-4">Save or copy a .cute code to your clipboard</p>
          <textarea
            ref={textareaRef}
            onClick={handleTextAreaClick}
            className="mb-6 p-2 border-solid border-2 rounded-md resize-none"
            readOnly={true}
            name="cuteCode"
            id="cuteCode"
            cols={30}
            rows={10}
            value={cuteCode}
          ></textarea>
          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4"
              onClick={saveToFile}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={closeModal}
            >
              Close
            </button>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default SaveModal;
