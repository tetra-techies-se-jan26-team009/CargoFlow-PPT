export const getCoordsFromPincode = async (pincode) => {
  if (pincode.length !== 6) return null;
  
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&countrycodes=in&format=json&addressdetails=1`,
      {
        headers: { "User-Agent": "CargoFlow-App-MVP" } 
      }
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        city: data[0].address.city || data[0].address.state_district || "Unknown City"
      };
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
  return null;
};