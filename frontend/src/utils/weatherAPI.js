import axios from "axios";

export const getWeather = async (lat, lon) => {
  try {
    const res = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true
        }
      }
    );

    return {
      temp: res.data.current_weather.temperature,
      wind: res.data.current_weather.windspeed
    };
  } catch (err) {
    console.error("Weather fetch failed:", err);
    return null;
  }
};