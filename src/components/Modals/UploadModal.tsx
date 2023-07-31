import React, { useRef, useState } from "react";
import { useControlBarContext } from "../../hooks/useControlBarContext";
import { getPrexel } from "../../utils/generateUtils";
import { UploadIcon } from "../Icons";
import { StringHash } from "../../contexts/ControlBarProvider";

const UploadModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, setCellColors } =
    useControlBarContext();
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
    const prexel: StringHash = getPrexel(cuteCode);
    setCellColors(prexel);
    clearModal();
  };

  const clearModal = () => {
    setCuteCode("");
    setFileName("");
    setIsUploadModalOpen(false);
  };

  if (isUploadModalOpen) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-900 bg-opacity-30 z-30">
        <div className="bg-white rounded-lg p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Upload a prexel?</h2>
          <p className="mb-4">Upload or paste a prexel code</p>
          <textarea
            ref={textareaRef}
            placeholder="paste prexel code here..."
            className="mb-4 p-2 border-solid border-2 rounded-md resize-none focus:outline-blue-400"
            name="cuteCode"
            id="cuteCode"
            cols={30}
            rows={10}
            value={cuteCode}
            onChange={handleChange}
          ></textarea>

          <span className="flex flex-row gap-4 mb-4 items-center">
            <button
              className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 outline outline-2 focus:outline-blue-400 flex flex-row items-center"
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
              className="text-blue-600 underline truncate"
              download={fileName}
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                cuteCode
              )}`}
            >
              {fileName}
            </a>
          </span>

          <span>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-4 outline outline-2 focus:outline-blue-400"
              onClick={loadBoard}
            >
              Load
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 outline outline-2 focus:outline-blue-400"
              onClick={clearModal}
            >
              Cancel
            </button>
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default UploadModal;
