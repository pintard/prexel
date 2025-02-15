import React, { useEffect } from "react";
import ThemeProvider from "../contexts/ThemeProvider";
import KeybindProvider from "../contexts/KeybindProvider";
import ControlBarProvider from "../contexts/ControlBarProvider";
import ColorPickerBoxProvider from "../contexts/ColorPickerBoxProvider";
import ControlBar from "../components/ControlBar";
import MenuBar from "../components/MenuBar";
import Artboard from "../components/Artboard";
import MenuBox from "../components/Boxes/MenuBox";
import DimensionBox from "../components/Boxes/DimensionBox";
import ColorPickerBox from "../components/Boxes/ColorPickerBox";
import ClearModal from "../components/Modals/ClearModal";
import SaveModal from "../components/Modals/SaveModal";
import UploadModal from "../components/Modals/UploadModal";
import KeybindModal from "../components/Modals/KeybindModal";
import PublishModal from "../components/Modals/PublishModal";

const Editor = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent): void => {
      e.preventDefault();
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <ThemeProvider>
      <KeybindProvider>
        <ControlBarProvider>
          <div className="h-full w-full grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-neutral-100 dark:bg-neutral-900">
            <ColorPickerBoxProvider>
              <div className="row-span-2">
                <ControlBar />
              </div>
              <div className="col-span-1">
                <MenuBar />
              </div>
              <div className="row-span-1 col-span-1 pr-6 pb-6">
                <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 rounded-xl border-solid border border-gray-200 dark:border-neutral-700 overflow-hidden relative">
                  <Artboard />
                  <MenuBox />
                  <DimensionBox />
                  <ColorPickerBox />
                </div>
              </div>
            </ColorPickerBoxProvider>
            <ClearModal />
            <SaveModal />
            <UploadModal />
            <KeybindModal />
            <PublishModal />
          </div>
        </ControlBarProvider>
      </KeybindProvider>
    </ThemeProvider>
  );
};

export default Editor;
