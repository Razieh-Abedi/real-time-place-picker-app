import { useState, useEffect } from "react";

export function useData(
  url,
  method = "GET",
  payload = null,
  errorMessage = "An error occurred!",
  initialValue
) {
  const [isLoading, setIsLoading] = useState();
  const [responseData, setResponseData] = useState(initialValue);
  const [requestError, setRequestError] = useState();

  useEffect(() => {
    async function httpRequest() {
      setIsLoading(true);
      try {
        const options = {
          method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        if (payload && (method === "POST" || method === "PUT")) {
          options.body = JSON.stringify(payload);
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        setResponseData(data);
      } catch (error) {
        setRequestError({ message: error.message || "An error occurred" });
      }
      setIsLoading(false);
    }
    httpRequest();
  }, [url, method, payload, errorMessage]);

  return { isLoading, responseData, requestError, setResponseData, setRequestError };
}
