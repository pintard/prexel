import {
  WINDOWS_KEY_MAP,
  MAC_KEY_MAP,
  LINUX_KEY_MAP,
  StringHash,
  PUNCTUATION_MAP,
} from "./constants";

export const getOperatingSystem = (): string => {
  const userAgent: string = window.navigator.userAgent;

  switch (true) {
    case userAgent.includes("Mac OS"):
      return "Mac";
    case userAgent.includes("Win"):
      return "Windows";
    case userAgent.includes("Linux"):
      return "Linux";
    default:
      return "Unknown";
  }
};

export const getKeyMap = (): StringHash => {
  return (
    {
      Mac: MAC_KEY_MAP,
      Windows: WINDOWS_KEY_MAP,
      Linux: LINUX_KEY_MAP,
    }[getOperatingSystem()] || LINUX_KEY_MAP
  );
};

export const getFriendlyKey = (code: string): string => {
  const keyMap: StringHash = getKeyMap();

  if (keyMap[code]) {
    return keyMap[code] as string;
  }

  if (code.startsWith("Digit")) {
    return code.charAt(5);
  }

  if (code.startsWith("Key")) {
    return code.charAt(3).toUpperCase();
  }

  if (PUNCTUATION_MAP[code]) {
    return PUNCTUATION_MAP[code] as string;
  }

  return code;
};
