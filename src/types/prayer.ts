export type MadhabTypes = "shafi" | "hanafi";

export type CalculationMethodType =
  | "MWL"
  | "ISNA"
  | "Egypt"
  | "Makkah"
  | "Karachi"
  | "Tehran"
  | "Jafari"
  | "Singapore";

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: Date;
}
