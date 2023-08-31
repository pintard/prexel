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
