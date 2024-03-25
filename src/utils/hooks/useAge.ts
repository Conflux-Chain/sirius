import React from 'react';
import { useAge as useAgeOriginal } from 'sirius-next/packages/common/dist/utils/hooks/useAge';

export const useAge = (format?: string) => {
  return useAgeOriginal(React, format);
};
