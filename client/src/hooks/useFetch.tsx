import { useState } from "react";
import config from "../utils/config";

interface FetchOptions<TBody> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: TBody | FormData | null;
  headers?: Record<string, string>;
}

interface FetchState<TData, TBody> {
  data: TData | null;
  error: string | null;
  isLoading: boolean;
  sendRequest: (
    endpoint: string,
    options: FetchOptions<TBody>
  ) => Promise<void>;
}

const useFetch = <TData, TBody>(): FetchState<TData, TBody> => {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendRequest = async (
    endpoint: string,
    { method = "GET", body = null, headers = {} }: FetchOptions<TBody>
  ): Promise<void> => {
    const URI = `${config.apiUrl}${endpoint}`;

    setIsLoading(true);

    try {
      const fetchHeaders = new Headers(headers);
      if (!(body instanceof FormData)) {
        fetchHeaders.append("Content-Type", "application/json");
      }

      const fetchOptions: RequestInit = {
        method,
        headers: fetchHeaders,
        body: body instanceof FormData ? body : JSON.stringify(body),
      };

      const response: Response = await fetch(URI, fetchOptions);

      if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
      }

      const jsonData = (await response.json()) as TData;
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
