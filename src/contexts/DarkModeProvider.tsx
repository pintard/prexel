import { ReactNode, createContext, useEffect, useMemo, useState } from "react";

export const DarkModeContext = createContext({
  darkMode: false,
  toggleDarkMode: () => {},
});

interface DarkModeProviderProps {
  children: ReactNode;
}

const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const existingPreference: string | null = localStorage.getItem("dark-mode");
    return existingPreference ? JSON.parse(existingPreference) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const value = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
    }),
    [darkMode]
  );

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
