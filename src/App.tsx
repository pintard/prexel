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
import MenuBar from "./components/MenuBar";
import MenuBox from "./components/Boxes/MenuBox";
import DimensionBox from "./components/Boxes/DimensionBox";
import ColorPickerBox from "./components/Boxes/ColorPickerBox";

const App = () => {
  return (
    <DarkModeProvider>
      <KeybindProvider>
        <ControlBarProvider>
          <div className="h-full w-full grid grid-rows-[auto_1fr] grid-cols-[auto_1fr] bg-gray-100">
            <div className="row-span-2">
              <ColorPickerBoxProvider>
                <ControlBar />
              </ColorPickerBoxProvider>
            </div>
            <div className="col-span-1">
              <MenuBar />
            </div>
            <div className="row-span-1 col-span-1 pr-4 pb-4">
              <div className="w-full h-full bg-gray-200 rounded-xl border-solid border border-gray-100 overflow-hidden relative">
                <Artboard />
                <MenuBox />
                <DimensionBox />
                <ColorPickerBox />
              </div>
            </div>
            <ClearModal />
            <SaveModal />
            <UploadModal />
            <KeybindModal />
          </div>
        </ControlBarProvider>
      </KeybindProvider>
    </DarkModeProvider>
  );
};

export default App;
