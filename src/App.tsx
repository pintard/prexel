import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";

import ControlBarProvider from "./contexts/ControlBarProvider";
import ColorPickerBoxProvider from "./contexts/ColorPickerBoxProvider";
import DarkModeProvider from "./contexts/DarkModeProvider";
import KeybindProvider from "./contexts/KeybindProvider";

import ClearModal from "./components/Modals/ClearModal";
import SaveModal from "./components/Modals/SaveModal";
import UploadModal from "./components/Modals/UploadModal";
import KeybindModal from "./components/Modals/KeybindModal";

const App = () => {
  return (
    <div className="h-full w-full dark:bg-neutral-900 bg-white">
      <DarkModeProvider>
        <KeybindProvider>
          <ControlBarProvider>
            <div className="h-full w-full flex flex-col">
              <ColorPickerBoxProvider>
                <ControlBar />
              </ColorPickerBoxProvider>
              <Artboard />
            </div>

            <ClearModal />
            <SaveModal />
            <UploadModal />
            <KeybindModal />
          </ControlBarProvider>
        </KeybindProvider>
      </DarkModeProvider>
    </div>
  );
};

export default App;
