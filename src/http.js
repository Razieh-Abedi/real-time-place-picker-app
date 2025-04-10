export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");
  const result = await response.json();
  if (!response.ok) {
    throw new Error("error fetching data places");
  }
  return result.places;
}

export async function updateUserPlaces(places) {
  const response = await fetch("http://localhost:3000/user-places", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ places }),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error("Failed to update user data.");
  }
  return result.message;
}

export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:3000/user-places");
  const result = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch user places");
  }
  return result.places;
}
