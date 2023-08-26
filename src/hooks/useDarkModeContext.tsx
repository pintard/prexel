import { useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";

export const useDarkModeContext = () => useContext(DarkModeContext);
