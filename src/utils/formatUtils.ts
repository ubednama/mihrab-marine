/**
 * Utility functions for formatting data in the app
 */

/**
 * Format a Date object to a time string in 12-hour format
 * @param date Date object to format
 * @returns Formatted time string (e.g., "12:30 PM")
 */
export const formatTime = (date: Date | null): string => {
  if (!date) return "--:--";
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format ocean name for display
 * @param oceanName The name of the ocean or sea
 * @returns Formatted ocean display string
 */
export const formatOceanDisplay = (oceanName: string): string => {
  if (oceanName === "Land") {
    return "On land";
  } else if (oceanName.includes("Ocean") || oceanName.includes("Waters")) {
    return `Current Waters: ${oceanName}`;
  } else {
    return oceanName;
  }
};

/**
 * Format coordinates for display
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Formatted coordinates string
 */
export const formatCoordinates = (latitude: number, longitude: number): string => {
  return `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`;
};