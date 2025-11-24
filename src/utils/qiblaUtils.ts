import * as Location from 'expo-location';

// Kaaba coordinates in Mecca, Saudi Arabia
const KAABA_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262
};

/**
 * Calculate the Qibla direction (bearing to Kaaba) from current location
 * @param currentLat Current latitude
 * @param currentLon Current longitude
 * @returns Qibla direction in degrees (0-360)
 */
export const calculateQiblaDirection = (currentLat: number, currentLon: number): number => {
  const lat1 = toRadians(currentLat);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - currentLon);

  const x = Math.sin(deltaLon) * Math.cos(lat2);
  const y = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  let bearing = Math.atan2(x, y);
  bearing = toDegrees(bearing);
  bearing = (bearing + 360) % 360; // Normalize to 0-360

  return bearing;
};

/**
 * Calculate the distance to Kaaba from current location
 * @param currentLat Current latitude
 * @param currentLon Current longitude
 * @returns Distance in kilometers
 */
export const calculateDistanceToKaaba = (currentLat: number, currentLon: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const lat1 = toRadians(currentLat);
  const lat2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLat = toRadians(KAABA_COORDINATES.latitude - currentLat);
  const deltaLon = toRadians(KAABA_COORDINATES.longitude - currentLon);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Get compass direction name from degrees
 * @param degrees Direction in degrees (0-360)
 * @returns Compass direction name
 */
export const getCompassDirection = (degrees: number): string => {
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Format distance for display
 * @param distance Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else if (distance < 1000) {
    return `${distance.toFixed(1)}km`;
  } else {
    return `${Math.round(distance)}km`;
  }
};

/**
 * Get Qibla direction with location permission check
 * @param location Current location object
 * @returns Object with qibla direction, distance, and compass direction
 */
export const getQiblaInfo = (location: Location.LocationObject | null) => {
  if (!location) {
    return {
      qiblaDirection: 0,
      distance: 0,
      compassDirection: 'N',
      formattedDistance: '0km',
      isValid: false
    };
  }

  const qiblaDirection = calculateQiblaDirection(
    location.coords.latitude,
    location.coords.longitude
  );
  
  const distance = calculateDistanceToKaaba(
    location.coords.latitude,
    location.coords.longitude
  );

  return {
    qiblaDirection,
    distance,
    compassDirection: getCompassDirection(qiblaDirection),
    formattedDistance: formatDistance(distance),
    isValid: true
  };
};

// Helper functions
const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
const toDegrees = (radians: number): number => radians * (180 / Math.PI);

/**
 * Normalize compass heading to 0-360 range
 * @param heading Raw compass heading
 * @returns Normalized heading
 */
export const normalizeHeading = (heading: number): number => {
  return ((heading % 360) + 360) % 360;
};

/**
 * Calculate the difference between two angles
 * @param angle1 First angle in degrees
 * @param angle2 Second angle in degrees
 * @returns Angle difference (-180 to 180)
 */
export const angleDifference = (angle1: number, angle2: number): number => {
  let diff = angle2 - angle1;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
};