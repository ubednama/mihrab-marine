import { getTimeOfDay, getTimeOfDayColors, THEME_COLORS } from '../src/utils/timeUtils';

describe('timeUtils', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const setMockTime = (hour: number) => {
    const date = new Date();
    date.setHours(hour);
    jest.setSystemTime(date);
  };

  test('getTimeOfDay returns correct time of day', () => {
    setMockTime(8); // 8 AM
    expect(getTimeOfDay()).toBe('Morning');

    setMockTime(14); // 2 PM
    expect(getTimeOfDay()).toBe('Afternoon');

    setMockTime(18); // 6 PM
    expect(getTimeOfDay()).toBe('Evening');

    setMockTime(22); // 10 PM
    expect(getTimeOfDay()).toBe('Night');
  });

  test('getTimeOfDayColors returns correct colors', () => {
    setMockTime(8);
    expect(getTimeOfDayColors()).toBe(THEME_COLORS.morning);

    setMockTime(14);
    expect(getTimeOfDayColors()).toBe(THEME_COLORS.afternoon);

    setMockTime(18);
    expect(getTimeOfDayColors()).toBe(THEME_COLORS.evening);

    setMockTime(22);
    expect(getTimeOfDayColors()).toBe(THEME_COLORS.night);
  });
});
