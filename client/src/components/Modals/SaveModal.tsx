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
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl flex flex-col shadow-lg">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4 text-gray-900 dark:text-gray-400">
              Save this prexel?
            </h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-5">
              Save or copy a prexel code to your clipboard
            </p>
            <textarea
              ref={textareaRef}
              onClick={handleTextAreaClick}
              className="mb-6 p-3 border-solid border-2 rounded-xl resize-none focus:outline-blue-400 w-full dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
              name="cuteCode"
              id="cuteCode"
              cols={30}
              rows={6}
              value={cuteCode}
              readOnly={true}
            ></textarea>
            <div className="flex gap-3">
              <button
                autoFocus={true}
                className="px-4 py-2 bg-inherit text-green-600 dark:text-green-400 rounded-full border border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-950 transition-colors"
                onClick={saveToFile}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-950 transition-colors"
                onClick={() => setIsSaveModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SaveModal;
