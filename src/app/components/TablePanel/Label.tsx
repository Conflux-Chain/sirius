import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import currency from 'currency.js';
import { Tooltip } from '@cfxjs/react-ui';

const StyledToolTip = createGlobalStyle`
  .tab-label-tooltip {
    .count {
      color: #DEDEDE;
    }
  }
`;
const StyledCount = styled.span`
  &:hover {
    color: #004fff;
  }
`;
export function TabLabel({ left, right, count, children }) {
  return (
    <>
      <StyledToolTip />
      {children}
      <span> </span>
      {count ? (
        <Tooltip
          text={
            <>
              {left}
              <span className="count"> {count} </span>
              {right}
            </>
          }
          portalClassName="tab-label-tooltip siriui-tooltip-square"
        >
          <StyledCount>({count > 9999 ? '9999+' : count})</StyledCount>
        </Tooltip>
      ) : (
        ''
      )}
    </>
  );
}
TabLabel.defaultProps = {
  left: '',
  right: '',
  count: 0,
};
TabLabel.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  count: PropTypes.number,
};

const StyledWrapper = styled.p`
  font-size: 14px;
  font-family: CircularStd-Book, CircularStd;
  font-weight: normal;
  color: #74798c;
  line-height: 18px;
  margin-top: 32px;
  margin-bottom: 24px;
`;
const StyledSpan = styled.span`
  font-size: 14px;
  font-family: CircularStd-Bold, CircularStd;
  font-weight: 500;
  color: #0054fe;
  line-height: 24px;
  padding: 0 5px;
`;
export function TipLabel({ count, left, right }) {
  const [number, setCount] = useState(count);
  useEffect(() => {
    // cache count number
    if (count) setCount(count);
  }, [count]);
  return (
    <StyledWrapper>
      {left}
      <StyledSpan>
        {currency(number, { symbol: '', precision: 0 }).format()}
      </StyledSpan>
      {right}
    </StyledWrapper>
  );
}
TipLabel.defaultProps = {
  left: '',
  right: '',
  count: 0,
};
TipLabel.propTypes = {
  left: PropTypes.string,
  right: PropTypes.string,
  count: PropTypes.number,
};
