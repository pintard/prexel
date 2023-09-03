import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";

import ControlBarProvider from "./contexts/ControlBarProvider";
import ColorPickerBoxProvider from "./contexts/ColorPickerBoxProvider";
import DarkModeProvider from "./contexts/DarkModeProvider";
import KeybindProvider from "./contexts/KeybindProvider";

import ClearModal from "./components/Modals/ClearModal";
import SaveModal from "./components/Modals/SaveModal";
import UploadModal from "./components/Modals/UploadModal";

const App = () => {
  return (
    <DarkModeProvider>
      <div className="h-full w-full bg-white dark:bg-neutral-900">
        <KeybindProvider>
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
        </KeybindProvider>
      </div>
    </DarkModeProvider>
  );
};

export default App;
