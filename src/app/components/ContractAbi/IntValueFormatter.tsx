import React, { useMemo, useState } from 'react';
import { DecimalsSelect } from '@cfxjs/sirius-next-common/dist/components/DecimalsSelect';
import { formatBalance } from 'utils';
import styled from 'styled-components';

interface IntValueFormatterProps {
  value?: any;
  maxDecimals?: number;
}

export const IntValueFormatter = ({
  value,
  maxDecimals,
}: IntValueFormatterProps) => {
  const [decimals, setDecimals] = useState<number | undefined>(18);
  const floatValue = useMemo(() => {
    if (value === null || value === undefined || value === '') return '';
    const str = value.toString();
    return formatBalance(str, Number(decimals ?? 0), true);
  }, [value, decimals]);
  return (
    <Wrapper>
      <span className="label">Select Decimals</span>
      <DecimalsSelect
        onChange={setDecimals}
        value={decimals}
        max={maxDecimals}
        placeholder="Select"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className="arrow"
      >
        <path
          d="M1.77778 10L5.77778 6L1.77778 2"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#FAFAFA"
        />
        <path
          d="M6.22222 10L10.2222 6L6.22222 2"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke="#FAFAFA"
        />
      </svg>
      <span className="float-value">Float value</span>
      <span>{floatValue}</span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 7px;
  margin-top: 8px;
  margin-bottom: 8px;
  gap: 8px;
  flex-wrap: wrap;
  .label {
    display: inline-block;
    width: 110px;
  }
  .arrow {
    display: inline-block;
    margin-right: 3px;
    margin-left: 8px;
    inline-block w-10px mr-3px ml-8px
  }
  .float-value {
    font-style: italic;
    color: rgba(255, 255, 255, 0.5);
  }
`;
