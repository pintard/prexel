import React, { useRef } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

const SaveModal = () => {
  const { cuteCode, isSaveModalOpen, setIsSaveModalOpen } =
    useControlBarContext();

  useModalState(isSaveModalOpen);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveToFile = () => {
    const blob: Blob = new Blob([cuteCode], { type: "text/plain" });
    const anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `prexel_${Math.floor(new Date().getTime() / 1000)}.txt`;
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
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-2xl flex flex-col">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4">Save this prexel?</h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 text-lg mb-5">
              Save or copy a prexel code to your clipboard
            </p>
              <textarea
                ref={textareaRef}
                onClick={handleTextAreaClick}
                className="mb-6 p-3 border-solid border-2 rounded-xl resize-none focus:outline-blue-400 w-full"
                name="cuteCode"
                id="cuteCode"
                cols={30}
                rows={6}
                value={cuteCode}
                readOnly={true}
              ></textarea>

            <button
              autoFocus={true}
              className="px-4 py-2 bg-white text-green-600 font-bold rounded-full hover:bg-green-50 mr-3 outline outline-1 focus:bg-green-50"
              onClick={saveToFile}
            >
              Save
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 outline outline-2 focus:outline-blue-300"
              onClick={() => setIsSaveModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SaveModal;
