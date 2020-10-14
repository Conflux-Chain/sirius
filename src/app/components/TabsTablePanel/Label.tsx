import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import numeral from 'numeral';
import Tooltip from '../Tooltip';

const Text = ({ left, right, count }) => (
  <>
    {left}
    <span className="count"> {count} </span>
    {right}
  </>
);

export function TabLabel({ left, right, count, children }) {
  return (
    <>
      {children}
      <span> </span>
      {count ? (
        <Tooltip
          placement="top"
          text={
            <StyledTextWrapper>
              <Text left={left} right={right} count={count}></Text>
            </StyledTextWrapper>
          }
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
  font-weight: 400;
  color: #74798c;
  line-height: 1.2857rem;
  margin: 1.7143rem 0 0.8571rem;
`;
const StyledSpan = styled.span`
  color: #1e3de4;
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

const StyledCount = styled.span`
  &:hover {
    color: #004fff;
  }
`;
const StyledTextWrapper = styled.span`
  .count {
    color: #ffffff;
  }
`;
