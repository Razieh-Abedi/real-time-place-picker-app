import { useState, useEffect } from "react";

import Places from "./Places.jsx";
import ErrorPage from "./ErrorPage.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { useHttp } from "../hooks/useHttp.js";

export default function AvailablePlaces({ onSelectPlace }) {
  
  const {
    isRequestLoading: isLoading,
    requestError: fetchingError,
    requestData: availablePlaces,
    setRequestData: setAvailablePlaces,
    httpRequest,
  } = useHttp([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      const places = await httpRequest(
        "http://localhost:3000/places", // replace with your real API
        "GET",
        null,
        "Failed to fetch available places."
      );

      if (!places) return;

      navigator.geolocation.getCurrentPosition((position) => {
        const sortedPlaces = sortPlacesByDistance(
          places,
          position.coords.latitude,
          position.coords.longitude
        );
        setAvailablePlaces(sortedPlaces);
      });
    };

    fetchPlaces();
  }, []);



  if (fetchingError) {
    return (
      <ErrorPage title="An error occurred" message={fetchingError.message} />
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
