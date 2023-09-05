export interface PagePosition {
  left: number;
  top: number;
}

export interface StringHash {
  [key: string]: string | undefined;
}

export const MAC_KEY_MAP: StringHash = {
  MetaLeft: "\u2318",
  MetaRight: "\u2318",
  AltLeft: "\u2325",
  AltRight: "\u2325",
  ControlLeft: "\u2303",
  ControlRight: "\u2303",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};

export const DEFAULT_KEY_MAP: StringHash = {
  MetaLeft: "cmd",
  MetaRight: "cmd",
  AltLeft: "alt",
  AltRight: "alt",
  ControlLeft: "ctrl",
  ControlRight: "ctrl",
  ShiftLeft: "shift",
  ShiftRight: "shift",
};
