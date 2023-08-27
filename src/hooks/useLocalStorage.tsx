import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const storedValue: string | null = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  const [state, setState] = useState<T>(initial);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

export default useLocalStorage;
