import React, { useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getPrexel } from "../../utils/generateUtils";
import { UploadIcon } from "../Icons";
import { StringHash as ColorGroup } from "../../utils/constants";
import useModalState from "../../hooks/useModalState";
import { HorizontalDivider } from "../Divider";

const UploadModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, updateColors } =
    useControlBarContext();

  useModalState(isUploadModalOpen);

  const [cuteCode, setCuteCode] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];

    if (file) {
      setFileName(file.name);
      const reader: FileReader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent: string = e.target?.result as string;

        if (/[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(fileContent)) {
          alert("Invalid file content. Please upload a valid prexel file.");
          setCuteCode("");
          setFileName("");
          return;
        }

        setCuteCode(fileContent);
      };

      reader.readAsText(file);
    }
  };

  const readFromFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCuteCode(event.target.value);
  };

  const loadBoard = () => {
    if (!cuteCode) {
      alert(
        "Upload a prexel via pasting it in the text box or uploading it from your device"
      );
      return;
    }

    const prexel: ColorGroup = getPrexel(cuteCode);
    updateColors(prexel);
    clearModal();
  };

  const clearModal = () => {
    setCuteCode("");
    setFileName("");
    setIsUploadModalOpen(false);
  };

  if (isUploadModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30 backdrop-blur-sm">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl flex flex-col shadow-lg">
          <div className="pt-8 pb-6 px-8">
            <h2 className="text-xl leading-4 text-gray-900 dark:text-gray-400">
              Upload a prexel?
            </h2>
          </div>
          <HorizontalDivider />
          <div className="pt-5 pb-6 px-8">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Upload a prexel from your device
              <br />
              or paste a prexel code
            </p>

            <span className="mb-8 flex flex-col">
              <textarea
                ref={textareaRef}
                placeholder="paste prexel code here..."
                className="p-3 border-solid border-2 border-b-0 rounded-t-xl resize-none focus:outline-blue-400 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700"
                name="cuteCode"
                id="cuteCode"
                cols={30}
                rows={6}
                value={cuteCode}
                onChange={handleChange}
              ></textarea>

              <span className="flex flex-row">
                <button
                  className="w-full px-4 py-3 bg-blue-400 text-white rounded-b-xl hover:bg-blue-500 active:bg-blue-400 focus:outline-blue-200 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:outline-none dark:focus:ring-2 dark:focus:ring-blue-500 transition-colors flex flex-row items-center justify-center"
                  onClick={readFromFile}
                  autoFocus={true}
                >
                  <UploadIcon
                    width={16}
                    height={16}
                    fill="white"
                    className="mr-3"
                  />
                  <span>Upload</span>
                </button>
                <input
                  ref={fileInputRef}
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <a
                  className="underline truncate"
                  download={fileName}
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    cuteCode
                  )}`}
                >
                  {fileName}
                </a>
              </span>
            </span>

            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-inherit text-green-600 dark:text-green-400 rounded-full border border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-950 transition-colors"
                onClick={loadBoard}
              >
                Load
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-950 transition-colors"
                onClick={clearModal}
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

export default UploadModal;
