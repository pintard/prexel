import { useContext } from "react";
import { KeybindContext } from "../contexts/KeybindProvider";

export const useKeybindContext = () => useContext(KeybindContext);
