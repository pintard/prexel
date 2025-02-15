export interface PagePosition {
  left: number;
  top: number;
}

export interface StringHash {
  [key: string]: string | undefined;
}

export type KeyArray = string[];

export const MAC_KEY_MAP: StringHash = {
  MetaLeft: "\u2318", // Command (⌘)
  MetaRight: "\u2318",
  AltLeft: "\u2325", // Option (⌥)
  AltRight: "\u2325",
  ControlLeft: "\u2303", // Control (⌃)
  ControlRight: "\u2303",
  ShiftLeft: "shift", // Shift
  ShiftRight: "shift",
};

export const LINUX_KEY_MAP: StringHash = {
  MetaLeft: "super",
  MetaRight: "super",
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

export const WINDOWS_KEY_MAP: StringHash = {
  MetaLeft: "win",
  MetaRight: "win",
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

export const PUNCTUATION_MAP: StringHash = {
  Comma: ",",
  Period: ".",
  Slash: "/",
  Quote: "'",
  Semicolon: ";",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Equal: "=",
  Minus: "-",
  Backquote: "`",
};
