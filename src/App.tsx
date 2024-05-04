import React from "react";

import Editor from "./Pages/Editor";
import Marketplace from "./Pages/Marketplace";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
};

export default App;
