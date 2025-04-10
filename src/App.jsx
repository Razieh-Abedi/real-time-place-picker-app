import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import { updateUserPlaces, fetchUserPlaces } from "./http.js";
import { useData } from "./hooks/useData.js";

function App() {
  const selectedPlace = useRef();
  const {
    isLoading,
    requestError: fetchingError,
    responseData: userPlaces,
  } = useData(
    "http://localhost:3000/user-places",
    "GET",
    null,
    "Failed to fetch user places",
    []
  );

  // const [userPlaces, setUserPlaces] = useState([]);
  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [FetchingError, setFetchingError] = useState();
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   if (responseData) {
  //     setUserPlaces(responseData);
  //   }
  // }, [responseData]);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // useEffect(() => {
  //   async function loadPlaces() {
  //     setIsLoading(true);
  //     try {
  //       const places = await fetchUserPlaces();
  //       setUserPlaces(places);
  //     } catch (error) {
  //       setFetchingError({
  //         message: error.message || "Failed to fetch user places",
  //       });
  //     }
  //     setIsLoading(false);
  //   }
  //   loadPlaces();
  // }, []);

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updateUserPlaces([selectedPlace, ...userPlaces]);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message:
          error.message ||
          "Failed to update the places. Please try again in a few minutes",
      });
    }
  }

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  // const handleRemovePlace = useCallback(
  //   async function handleRemovePlace() {
  //     setUserPlaces((prevPickedPlaces) =>
  //       prevPickedPlaces.filter(
  //         (place) => place.id !== selectedPlace.current.id
  //       )
  //     );

  //     try {
  //       await updateUserPlaces(
  //         userPlaces.filter((place) => place.id !== selectedPlace.current.id)
  //       );
  //     } catch (error) {
  //       setUserPlaces(userPlaces);
  //       setErrorUpdatingPlaces({
  //         message: error.message || "Failed to delete place!",
  //       });
  //     }

  //     setModalIsOpen(false);
  //   },
  //   [userPlaces]
  // );

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <ErrorPage
            title="Updating failed"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          // onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {fetchingError && (
          <ErrorPage
            title="An error occurred!"
            message={fetchingError.message}
          />
        )}
        {!fetchingError && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isLoading}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}
        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
