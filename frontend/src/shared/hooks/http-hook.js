import { useState, useCallback, useEffect, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]); // create a ref to store the abort controllers in an array

  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setIsLoading(true);
    const httpAbortCtrl = new AbortController(); // create an abort controller for each request
    activeHttpRequests.current.push(httpAbortCtrl); // add the abort controller to the array
    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortCtrl.signal, // pass the abort controller to the fetch request
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      return responseData;
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Something went wrong, please try again.");
      throw err;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      console.log("Cleanup");
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()); // abort all the requests when the component unmounts
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

