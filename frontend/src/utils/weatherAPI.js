import axios from "axios";

const API_KEY = "YOUR_API_KEY";

export const getWeather = async (lat, lon) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
};