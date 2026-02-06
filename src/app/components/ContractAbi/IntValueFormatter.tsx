import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import imgArray from 'images/two_array.png';
import { formatBalance } from '@cfxjs/sirius-next-common/dist/utils';
import { DecimalsSelect } from '@cfxjs/sirius-next-common/dist/components/DecimalsSelect';

interface IntValueFormatterProps {
  value?: any;
  maxDecimals?: number;
}

const IntValueFormatter = ({ value, maxDecimals }: IntValueFormatterProps) => {
  const [decimals, setDecimals] = useState<number | undefined>(18);
  const floatValue = useMemo(() => {
    if (!value) return '';
    const str = value.toString();
    return formatBalance(str, Number(decimals ?? 0), true);
  }, [value, decimals]);
  return (
    <Container>
      <span className="label">Select Decimals</span>
      <DecimalsSelect
        onChange={setDecimals}
        value={decimals}
        max={maxDecimals}
        placeholder="Select"
      />
      <img src={imgArray} alt="" className="icon" />
      <span className="type">Float value</span>
      <span>{floatValue}</span>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  align-items: center;
  padding-left: 7px;
  margin: 8px 0;
  gap: 8px;
  flex-wrap: wrap;
  img.icon {
    display: inline-block;
    width: 10px;
    margin-right: 3px;
    margin-left: 8px;
  }
  .type {
    color: #97a3b4;
    font-style: italic;
  }
  .label {
    display: inline-block;
    width: 110px;
  }
`;
export default IntValueFormatter;
