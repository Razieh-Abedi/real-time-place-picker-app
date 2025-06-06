import { useState, useCallback } from "react";

export function useHttp(initialData) {
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [requestData, setRequestData] = useState(initialData);

  const httpRequest = useCallback(
    async (
      requestUrl,
      requestMethod = "GET",
      requestPayload = null,
      requestErrorMsg = "An error occurred!"
    ) => {
      setIsRequestLoading(true);
      setRequestError(null);
      try {
        const options = {
          method: requestMethod,
          headers: {
            "Content-Type": "application/json",
          },
        };
        if (
          requestPayload &&
          (requestMethod === "PUT" ||
            requestMethod === "DELETE" ||
            requestMethod === "POST")
        ) {
          options.body = JSON.stringify({ places: requestPayload });
        }
        const response = await fetch(requestUrl, options);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(requestErrorMsg);
        }
        let data;
        if (requestMethod === "GET") {
          data = result.places;
        } else if (requestMethod === "PUT") {
          data = result.requestPayload;
        }
        setRequestData(data);
        return data;
      } catch (error) {
        setRequestError({
          message: requestErrorMsg || "The request was not fulfilled.",
        });
        return null;
      } finally {
        setIsRequestLoading(false);
      }
    },
    []
  );

  return {
    isRequestLoading,
    requestError,
    requestData,
    setRequestError,
    setRequestData,
    httpRequest,
  };
}
