import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface LocationContextType {
  location: LocationData | null;
  city: string;
  isManual: boolean;
  isLoading: boolean;
  updateLocation: (lat: number, long: number) => Promise<void>;
  detectLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [city, setCity] = useState<string>("Unknown Location");
  const [isManual, setIsManual] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      setIsLoading(true);
      const savedManual = await AsyncStorage.getItem("isManualLocation");
      const savedLat = await AsyncStorage.getItem("manualLatitude");
      const savedLong = await AsyncStorage.getItem("manualLongitude");

      if (savedManual === "true" && savedLat && savedLong) {
        setIsManual(true);
        const loc = {
          latitude: parseFloat(savedLat),
          longitude: parseFloat(savedLong),
        };
        setLocation(loc);
        await getCityName(loc.latitude, loc.longitude);
      } else {
        await detectLocation();
      }
    } catch (error) {
      console.error("Error loading location:", error);
      await detectLocation();
    } finally {
      setIsLoading(false);
    }
  };

  const updateLocation = async (lat: number, long: number) => {
    try {
      setIsLoading(true);
      setIsManual(true);
      const loc = { latitude: lat, longitude: long };
      setLocation(loc);

      await AsyncStorage.setItem("isManualLocation", "true");
      await AsyncStorage.setItem("manualLatitude", lat.toString());
      await AsyncStorage.setItem("manualLongitude", long.toString());

      await getCityName(lat, long);
    } catch (error) {
      console.error("Error updating manual location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        // Default to Mecca if permission denied
        const defaultLoc = { latitude: 21.4225, longitude: 39.8262 };
        setLocation(defaultLoc);
        setCity("Mecca (Default)");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const newLoc = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setLocation(newLoc);
      setIsManual(false);

      await AsyncStorage.setItem("isManualLocation", "false");
      await AsyncStorage.removeItem("manualLatitude");
      await AsyncStorage.removeItem("manualLongitude");

      await getCityName(newLoc.latitude, newLoc.longitude);
    } catch (error) {
      console.warn("Location detection failed, using fallback:", error);
      // Fallback to Mecca on error
      const defaultLoc = { latitude: 21.4225, longitude: 39.8262 };
      setLocation(defaultLoc);
      setCity("Mecca (Default)");
    } finally {
      setIsLoading(false);
    }
  };

  const getCityName = async (lat: number, lon: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (result.length > 0) {
        const address = result[0];
        const cityName =
          address.city ||
          address.subregion ||
          address.region ||
          address.country ||
          "Unknown Location";
        setCity(cityName);
      } else {
        setCity("Unknown Location");
      }
    } catch (e) {
      console.warn("Reverse geocoding failed:", e);
      setCity(`${lat.toFixed(2)}, ${lon.toFixed(2)}`);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        city,
        isManual,
        isLoading,
        updateLocation,
        detectLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return context;
};
