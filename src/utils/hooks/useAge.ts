import { useEffect, useState } from 'react';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

export const useAge = (format?: string) => {
  const [ageFormat, toggleAgeFormat] = useState(
    format ||
      localStorage.getItem(LOCALSTORAGE_KEYS_MAP.ageFormat) !== 'datetime'
      ? 'age'
      : 'datetime',
  );
  useEffect(() => {
    if (localStorage.getItem(LOCALSTORAGE_KEYS_MAP.ageFormat) !== ageFormat) {
      localStorage.setItem(LOCALSTORAGE_KEYS_MAP.ageFormat, ageFormat);
    }
  }, [format, ageFormat]);
  return [ageFormat, toggleAgeFormat];
};
