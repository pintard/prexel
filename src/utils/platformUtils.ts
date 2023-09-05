import { DEFAULT_KEY_MAP, MAC_KEY_MAP } from "./constants";

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

export const getFriendlyKey = (code: string): string => {
  const friendlyKey: string | undefined =
    getOperatingSystem() === "Mac" ? MAC_KEY_MAP[code] : DEFAULT_KEY_MAP[code];

  if (code.startsWith("Key")) {
    return code.charAt(3);
  }

  return friendlyKey || code;
};
