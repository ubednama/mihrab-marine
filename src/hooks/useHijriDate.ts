import { useState, useEffect } from 'react';
import axios from 'axios';

export const useHijriDate = () => {
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  useEffect(() => {
    getHijriDate();
  }, []);

  const getHijriDate = async () => {
    try {
      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

      setGregorianDate(date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      }));
      const response = await axios.get(
        `https://api.aladhan.com/v1/gToH/${formattedDate}`
      );
      if (response.data.code === 200) {
        const h = response.data.data.hijri;
        setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
      }
    } catch (e) {
      console.error("Error fetching Hijri date:", e);
    }
  };

  return { hijriDate, gregorianDate };
};
