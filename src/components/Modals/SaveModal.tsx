import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getCuteCode } from "../../utils/generateUtils";

const SaveModal = () => {
  const { cellColors, rows, cols, isSaveModalOpen, setIsSaveModalOpen } =
    useControlBarContext();
  const [cuteCode, setCuteCode] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCuteCode(getCuteCode(cellColors, rows, cols));
  }, [cellColors, rows, cols]);

  const saveToFile = () => {
    const blob: Blob = new Blob([cuteCode], { type: "text/plain" });
    const anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `prexel-${new Date().toISOString()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(anchor.href);
  };

  const handleTextAreaClick = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      navigator.clipboard
        .writeText(cuteCode)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy text: ", error);
        });
    }
  };

  if (isSaveModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-20">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Save this prexel?</h2>
          <p className="mb-4">Save or copy a prexel code to your clipboard</p>
          <textarea
            ref={textareaRef}
            onClick={handleTextAreaClick}
            className="mb-6 p-2 border-solid border-2 rounded-md resize-none focus:outline-blue-400"
            readOnly={true}
            name="cuteCode"
            id="cuteCode"
            cols={30}
            rows={10}
            value={cuteCode}
          ></textarea>
          <span>
            <button
              autoFocus={true}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={saveToFile}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={() => setIsSaveModalOpen(false)}
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
