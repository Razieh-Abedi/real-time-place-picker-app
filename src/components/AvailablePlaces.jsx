import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [FetchingError, setFetchingError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/places");
        const result = await response.json();
        if (!response.ok) {
          throw new Error("error fetching data places");
        }
        setAvailablePlaces(result.places);
      } catch (error) {
        setFetchingError({
          message:
            error.message || "Something went wrong. Try again in a few seconds",
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (FetchingError) {
    return (
      <ErrorPage title="An error occurred" message={FetchingError.message} />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isLoading}
      loadingText="fetching places data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
