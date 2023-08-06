import React from "react";
import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";

import ControlBarProvider from "./contexts/ControlBarProvider";
import ColorPickerBoxProvider from "./contexts/ColorPickerBoxProvider";

import ClearModal from "./components/Modals/ClearModal";
import SaveModal from "./components/Modals/SaveModal";
import UploadModal from "./components/Modals/UploadModal";

const App = () => {
  return (
    <div className="h-full w-full">
      <ControlBarProvider>
        <div className="h-full w-full flex justify-center items-center relative">
          <Artboard />
          <ColorPickerBoxProvider>
            <ControlBar />
          </ColorPickerBoxProvider>
        </div>
        <ClearModal />
        <SaveModal />
        <UploadModal />
      </ControlBarProvider>
    </div>
  );
};

export default App;
