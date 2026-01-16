import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalculationMethodType, MadhabTypes } from "@/types";

interface PrayerSchoolContextType {
  prayerSchool: MadhabTypes;
  calculationMethod: CalculationMethodType;
  setPrayerSchool: (school: MadhabTypes) => Promise<void>;
  setCalculationMethod: (method: CalculationMethodType) => Promise<void>;
  isLoading: boolean;
}

const PrayerSchoolContext = createContext<PrayerSchoolContextType | undefined>(
  undefined
);

export const PrayerSchoolProvider = ({ children }: { children: ReactNode }) => {
  const [prayerSchool, setPrayerSchoolState] = useState<MadhabTypes>("shafi");
  const [calculationMethod, setCalculationMethodState] =
    useState<CalculationMethodType>("MWL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSchool = await AsyncStorage.getItem("prayerSchool");
        const savedMethod = await AsyncStorage.getItem("calculationMethod");

        if (savedSchool === "shafi" || savedSchool === "hanafi") {
          setPrayerSchoolState(savedSchool as MadhabTypes);
        }
        if (savedMethod) {
          setCalculationMethodState(savedMethod as CalculationMethodType);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setPrayerSchool = async (school: MadhabTypes) => {
    try {
      setPrayerSchoolState(school);
      await AsyncStorage.setItem("prayerSchool", school);
    } catch (error) {
      console.error("Error saving prayer school:", error);
    }
  };

  const setCalculationMethod = async (method: CalculationMethodType) => {
    try {
      setCalculationMethodState(method);
      await AsyncStorage.setItem("calculationMethod", method);
    } catch (error) {
      console.error("Error saving calculation method:", error);
    }
  };

  return (
    <PrayerSchoolContext.Provider
      value={{
        prayerSchool,
        calculationMethod,
        setPrayerSchool,
        setCalculationMethod,
        isLoading,
      }}
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
