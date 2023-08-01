import { useContext } from "react";
import { ColorPickerBoxContext } from "../contexts/ColorPickerBoxProvider";

export const useColorPickerBoxContext = () => useContext(ColorPickerBoxContext);
