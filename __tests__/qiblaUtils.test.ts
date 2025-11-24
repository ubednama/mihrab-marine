import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  getCompassDirection,
  formatDistance,
  normalizeHeading,
  angleDifference
} from '../src/utils/qiblaUtils';

describe('qiblaUtils', () => {
  // Test coordinates (e.g., London)
  const LONDON_LAT = 51.5074;
  const LONDON_LON = -0.1278;
  
  // Expected Qibla from London is approx 118.98 degrees
  
  test('calculateQiblaDirection returns correct angle', () => {
    const qibla = calculateQiblaDirection(LONDON_LAT, LONDON_LON);
    expect(qibla).toBeCloseTo(118.98, 1);
  });

  test('calculateDistanceToKaaba returns correct distance', () => {
    const distance = calculateDistanceToKaaba(LONDON_LAT, LONDON_LON);
    // Approx distance from London to Mecca is 4783 km
    expect(distance).toBeCloseTo(4794, -1); // Check within 10km
  });

  test('getCompassDirection returns correct cardinal direction', () => {
    expect(getCompassDirection(0)).toBe('N');
    expect(getCompassDirection(90)).toBe('E');
    expect(getCompassDirection(180)).toBe('S');
    expect(getCompassDirection(270)).toBe('W');
    expect(getCompassDirection(45)).toBe('NE');
  });

  test('formatDistance formats correctly', () => {
    expect(formatDistance(0.5)).toBe('500m');
    expect(formatDistance(150.5)).toBe('150.5km');
    expect(formatDistance(2000)).toBe('2000km');
  });

  test('normalizeHeading normalizes correctly', () => {
    expect(normalizeHeading(370)).toBe(10);
    expect(normalizeHeading(-10)).toBe(350);
    expect(normalizeHeading(360)).toBe(0);
  });

  test('angleDifference calculates shortest path', () => {
    expect(angleDifference(10, 20)).toBe(10);
    expect(angleDifference(350, 10)).toBe(20);
    expect(angleDifference(10, 350)).toBe(-20);
    expect(angleDifference(0, 180)).toBe(180); // or -180
  });
});
