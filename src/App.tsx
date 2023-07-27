import React, { useState } from "react";
import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";
import ControlBarProvider from "./contexts/ControlBarProvider";
import ClearModal from "./components/Modals/ClearModal";
import SaveModal from "./components/Modals/SaveModal";
import UploadModal from "./components/Modals/UploadModal";

const App = () => {
  return (
    <ControlBarProvider>
      <div className="h-full w-full">
        <div className="h-full w-full flex justify-center items-center relative">
          <Artboard />
          <ControlBar />
        </div>
        <ClearModal />
        <SaveModal />
        <UploadModal />
      </div>
    </ControlBarProvider>
  );
};

export default App;
