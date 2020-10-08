import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import numeral from 'numeral';
import { Tooltip } from '@cfxjs/react-ui';

const StyledToolTipLabel = createGlobalStyle`
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
      <StyledToolTipLabel />
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

const StyledTipLabelWrapper = styled.p`
  font-size: 1rem;
  font-family: CircularStd-Book, CircularStd;
  font-weight: 400;
  color: #74798c;
  line-height: 1.2857rem;
  margin: 1.7143rem 0;
`;
const StyledSpan = styled.span`
  color: #0054fe;
  padding: 0 0.4286rem;
`;
export function TipLabel({ count, left, right }) {
  const [number, setCount] = useState(count);
  useEffect(() => {
    // cache count number
    if (count) setCount(count);
  }, [count]);
  return (
    <StyledTipLabelWrapper>
      {left}
      <StyledSpan>{numeral(number).format('0,0')}</StyledSpan>
      {right}
    </StyledTipLabelWrapper>
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
