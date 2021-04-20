import { useEffect, useState } from 'react';

export const useAge = (format?: string) => {
  const [ageFormat, toggleAgeFormat] = useState(
    format ||
      localStorage.getItem('conflux-scan-table-age-format') !== 'datetime'
      ? 'age'
      : 'datetime',
  );
  useEffect(() => {
    if (localStorage.getItem('conflux-scan-table-age-format') !== ageFormat) {
      localStorage.setItem('conflux-scan-table-age-format', ageFormat);
    }
  }, [format, ageFormat]);
  return [ageFormat, toggleAgeFormat];
};
