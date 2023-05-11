/**
 *
 * Footer
 *
 */
import React from 'react';
import { formatPrice } from './../../../utils';
import { Tooltip } from 'app/components/Tooltip/Loadable';

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
      text={
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
