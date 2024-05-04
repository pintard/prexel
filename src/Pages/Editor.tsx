import React from "react";
import DarkModeProvider from "../contexts/DarkModeProvider";
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
  return (
    <DarkModeProvider>
      <KeybindProvider>
        <ControlBarProvider>
          <div className="h-full w-full grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-gray-100">
            <ColorPickerBoxProvider>
              <div className="row-span-2">
                <ControlBar />
              </div>
              <div className="col-span-1">
                <MenuBar />
              </div>
              <div className="row-span-1 col-span-1 pr-4 pb-4">
                <div className="w-full h-full bg-gray-200 rounded-xl border-solid border border-gray-200 overflow-hidden relative">
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
    </DarkModeProvider>
  );
};

export default Editor;
