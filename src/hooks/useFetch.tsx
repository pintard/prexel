import { useState } from "react";

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

interface FetchState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

const useFetch = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendRequest = async (
    URL: string,
    { method = "GET", body = null, headers = {} }: FetchOptions
  ) => {
    setIsLoading(true);
    try {
      const fetchHeaders = { "Content-Type": "application/json", ...headers };
      const fetchOptions: RequestInit = {
        method,
        headers: fetchHeaders,
        body:
          method === "POST" || method === "PUT" ? JSON.stringify(body) : null,
      };

      const response: Response = await fetch(URL, fetchOptions);

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      const jsonData = (await response.json()) as T;
      setData(jsonData);
      setError(null);
    } catch (error: any) {
      setError(`Failed to fetch: ${error.toString()}`);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, sendRequest };
};

export default useFetch;
