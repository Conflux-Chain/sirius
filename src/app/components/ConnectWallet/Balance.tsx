import React from 'react';
import { usePortal } from 'utils/hooks/usePortal';
import { formatNumber } from 'utils';

export const Balance = () => {
  const { useBalance } = usePortal();
  const balance = useBalance();

  return (
    <span className="balance">
      {formatNumber(balance?.toDecimalStandardUnit() ?? 0, {
        precision: 6,
      })}{' '}
      CFX
    </span>
  );
};
