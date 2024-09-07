import { useContext } from "react";
import { ControlBarContext } from "../contexts/ControlBarProvider";

export const useControlBarContext = () => useContext(ControlBarContext);
