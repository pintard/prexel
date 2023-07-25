import React from "react";
import Artboard from "./components/Artboard";
import ControlBar from "./components/ControlBar";
import ControlBarProvider from "./contexts/ControlBarProvider";

const App = () => {
  return (
    <ControlBarProvider>
      <div className="h-full w-full p-5">
        <div className="h-full w-full flex justify-center items-center relative">
          <Artboard />
          <ControlBar />
        </div>
      </div>
    </ControlBarProvider>
  );
};

export default App;
