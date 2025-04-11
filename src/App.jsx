import { useRef, useState, useCallback, useEffect } from "react";

import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import { useHttp } from "./hooks/useHttp.js";

function App() {
  const selectedPlace = useRef();

  const {
    isRequestLoading: isLoading,
    requestError: fetchingError,
    requestData: userPlaces,
    httpRequest: fetchData,
  } = useHttp([]);

  const {
    requestError: errorUpdatingPlaces,
    setRequestError: setErrorUpdatingPlaces,
    setRequestData: setUserPlaces,
    httpRequest: updateData,
  } = useHttp([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchData(
      "http://localhost:3000/user-places",
      "GET",
      null,
      "Failed to fetch user places."
    );
  }, [fetchData]);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  // async function handleSelectPlace(selectedPlace) {
  //   setUserPlaces((prevPickedPlaces) => {
  //     if (!prevPickedPlaces) {
  //       prevPickedPlaces = [];
  //     }
  //     if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
  //       return prevPickedPlaces;
  //     }
  //     return [selectedPlace, ...prevPickedPlaces];
  //   });

  //   await updateData(
  //     "http://localhost:3000/user-places",
  //     "PUT",
  //     [selectedPlace, ...userPlaces],
  //     "Failed to update user places."
  //   );
  // }

  async function handleSelectPlace(selsectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      const updatedPlaces = !prevPickedPlaces
        ? [selectedPlace]
        : prevPickedPlaces.some((place) => place.id === selectedPlace.id)
        ? prevPickedPlaces
        : [selectedPlace, ...prevPickedPlaces];

      updateData(
        "http://localhost:3000/user-places",
        "PUT",
        updatedPlaces,
        "Failed to update user places."
      );

      return updatedPlaces;
    });
  }

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  const handleRemovePlace = useCallback(
    async function handleRemovePlace() {
      setUserPlaces((prevPickedPlaces) =>
        prevPickedPlaces.filter(
          (place) => place.id !== selectedPlace.current.id
        )
      );
      await updateData(
        "http://localhost:3000/user-places",
        "PUT",
        userPlaces.filter((place) => place.id !== selectedPlace.current.id),
        "Failed to remove the user place"
      );
      setModalIsOpen(false);
    },
    [userPlaces, updateData]
  );

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
          onConfirm={handleRemovePlace}
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
