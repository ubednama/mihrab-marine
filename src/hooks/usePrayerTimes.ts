import { useState, useEffect } from 'react';
import { PrayerTimes, Coordinates, CalculationMethod } from 'adhan';
import { PrayerTime } from '@/types';
import { getNextPrayer, getTimeUntilNextPrayer } from '@/utils/notificationUtils';

interface UsePrayerTimesProps {
  location: { latitude: number; longitude: number } | null;
  prayerSchool: string;
}

export const usePrayerTimes = ({ location, prayerSchool }: UsePrayerTimesProps) => {
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  useEffect(() => {
    if (location) {
      calculatePrayerTimes(location);
    }
  }, [location, prayerSchool]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextPrayer) {
        setTimeUntilNext(getTimeUntilNextPrayer(nextPrayer));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  const calculatePrayerTimes = (loc: { latitude: number; longitude: number }) => {
    const coordinates = new Coordinates(loc.latitude, loc.longitude);
    const date = new Date();
    const params = CalculationMethod.MoonsightingCommittee();
    params.madhab = prayerSchool as any; // Cast to any if type mismatch, or ensure prayerSchool matches Madhab type
    const prayerTimes = new PrayerTimes(coordinates, date, params);

    const newPrayers = [
      { name: "Fajr", time: prayerTimes.fajr, arabicName: "الفجر" },
      { name: "Sunrise", time: prayerTimes.sunrise, arabicName: "الشروق" },
      { name: "Dhuhr", time: prayerTimes.dhuhr, arabicName: "الظهر" },
      { name: "Asr", time: prayerTimes.asr, arabicName: "العصر" },
      { name: "Maghrib", time: prayerTimes.maghrib, arabicName: "المغرب" },
      { name: "Isha", time: prayerTimes.isha, arabicName: "العشاء" },
    ];

    // Calculate Tahajjud (Last third of the night)
    const maghribTime = prayerTimes.maghrib.getTime();
    const fajrNextDay = prayerTimes.fajr.getTime() + 24 * 60 * 60 * 1000; // Approximate next day Fajr
    const nightDuration = fajrNextDay - maghribTime;
    const tahajjudTime = new Date(maghribTime + (nightDuration * 2) / 3);

    newPrayers.push({
      name: "Tahajjud",
      time: tahajjudTime,
      arabicName: "التهجد",
    });

    setPrayers(newPrayers);
    setNextPrayer(getNextPrayer(newPrayers));
  };

  return { prayers, nextPrayer, timeUntilNext };
};
