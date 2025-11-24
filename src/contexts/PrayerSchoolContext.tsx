import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MadhabTypes } from "@/types";

interface PrayerSchoolContextType {
  prayerSchool: MadhabTypes;
  setPrayerSchool: (school: MadhabTypes) => Promise<void>;
  isLoading: boolean;
}

const PrayerSchoolContext = createContext<PrayerSchoolContextType | undefined>(
  undefined
);

export const PrayerSchoolProvider = ({ children }: { children: ReactNode }) => {
  const [prayerSchool, setPrayerSchoolState] = useState<MadhabTypes>("shafi");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPrayerSchool = async () => {
      try {
        const savedSchool = await AsyncStorage.getItem("prayerSchool");
        if (savedSchool === "shafi" || savedSchool === "hanafi") {
          setPrayerSchoolState(savedSchool as MadhabTypes);
        }
      } catch (error) {
        console.error("Error loading prayer school:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerSchool();
  }, []);

  const setPrayerSchool = async (school: MadhabTypes) => {
    try {
      setPrayerSchoolState(school);
      await AsyncStorage.setItem("prayerSchool", school);
    } catch (error) {
      console.error("Error saving prayer school:", error);
    }
  };

  return (
    <PrayerSchoolContext.Provider
      value={{ prayerSchool, setPrayerSchool, isLoading }}
    >
      {children}
    </PrayerSchoolContext.Provider>
  );
};

export const usePrayerSchool = () => {
  const context = useContext(PrayerSchoolContext);
  if (context === undefined) {
    throw new Error(
      "usePrayerSchool must be used within a PrayerSchoolProvider"
    );
  }
  return context;
};
