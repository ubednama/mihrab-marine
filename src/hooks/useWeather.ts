import { useState, useEffect } from 'react';

interface UseWeatherProps {
  location: { latitude: number; longitude: number } | null;
}

export const useWeather = ({ location }: UseWeatherProps) => {
  const [temperature, setTemperature] = useState<string | null>(null);
  const [aqi, setAqi] = useState<number | null>(null);

  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude);
    }
  }, [location]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
      );
      const data = await response.json();
      if (data.current && data.current.temperature_2m) {
        setTemperature(`${Math.round(data.current.temperature_2m)}°C`);
      }

      // Fetch AQI
      const aqiResponse = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
      );
      const aqiData = await aqiResponse.json();
      if (aqiData.current && aqiData.current.us_aqi) {
        setAqi(aqiData.current.us_aqi);
      }
    } catch (e) {
      console.error("Error fetching weather:", e);
    }
  };

  return { temperature, aqi };
};
