import React, { useEffect, useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getCuteCode } from "../../utils/generateUtils";
import { UploadIcon } from "../Icons";

const UploadModal = () => {
  const { cellColors, rows, cols, isUploadModalOpen, setIsUploadModalOpen } =
    useControlBarContext();
  const [cuteCode, setCuteCode] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // setCuteCode(getCuteCode(cellColors, rows, cols));
  }, [cellColors, rows, cols]);

  const readFromFile = () => {
    setIsUploadModalOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCuteCode(event.target.value);
  };

  if (isUploadModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-20">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Upload a prexel?</h2>
          <p className="mb-4">Upload or paste a prexel code</p>
          <textarea
            autoFocus={true}
            ref={textareaRef}
            placeholder="paste prexel code here..."
            className="mb-6 p-2 border-solid border-2 rounded-md resize-none focus:outline-blue-400"
            name="cuteCode"
            id="cuteCode"
            cols={30}
            rows={10}
            value={cuteCode}
            onChange={handleChange}
          ></textarea>
          <button className="w-2/5 px-4 py-2 mb-4 bg-blue-400 text-white rounded hover:bg-blue-500 outline outline-2 focus:outline-blue-400 flex flex-row items-center">
            <UploadIcon width={16} height={16} fill="white" className="mr-3" />
            <span>Upload</span>
          </button>
          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={readFromFile}
            >
              Generate
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={() => setIsUploadModalOpen(false)}
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

export default UploadModal;
