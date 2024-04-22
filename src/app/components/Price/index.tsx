/**
 *
 * Footer
 *
 */
import React from 'react';
import { formatPrice } from './../../../utils';
import { Tooltip } from 'sirius-next/packages/common/dist/components/Tooltip';

export const Price = ({
  children,
  showTooltip = true,
}: {
  children: string | number;
  showTooltip?: boolean;
}) => {
  if (['NaN', 'undefined', 'null'].includes(String(children))) {
    return <span>--</span>;
  }

  const [fPrice, fullPrice] = formatPrice(children);

  return fullPrice && showTooltip ? (
    <Tooltip
      title={
        <span
          style={{
            whiteSpace: 'nowrap',
          }}
        >
          {fullPrice}
        </span>
      }
    >
      <span>{fPrice}</span>
    </Tooltip>
  ) : (
    <span>{fPrice}</span>
  );
};
