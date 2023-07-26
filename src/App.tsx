import React, { useState } from "react";
import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";
import ControlBarProvider from "./contexts/ControlBarProvider";
import ClearModal from "./components/ClearModal";
import SaveModal from "./components/SaveModal";

const App = () => {
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);

  return (
    <ControlBarProvider>
      <div className="h-full w-full">
        <div className="h-full w-full flex justify-center items-center relative">
          <Artboard />
          <ControlBar
            openClearModal={() => setIsClearModalOpen(true)}
            openSaveModal={() => setIsSaveModalOpen(true)}
          />
        </div>
        <ClearModal
          isOpen={isClearModalOpen}
          closeModal={() => setIsClearModalOpen(false)}
        />
        <SaveModal
          isOpen={isSaveModalOpen}
          closeModal={() => setIsSaveModalOpen(false)}
        />
      </div>
    </ControlBarProvider>
  );
};

export default App;
