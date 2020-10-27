import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Tooltip } from '../Tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import numeral from 'numeral';

interface LabelProps {
  left?: string;
  right?: string;
  count?: number;
}

const defaultProps = {
  left: '',
  right: '',
  count: 0,
};

const Text = ({ left, right, count = 0 }: LabelProps) => {
  const { t } = useTranslation();
  const translateText =
    count < 10000
      ? translations.general.tabLabel.lt10000
      : translations.general.tabLabel.gte10000;
  return (
    <>
      {t(translateText, {
        sum: numeral(count).format('0,0'),
      })}
    </>
  );
};

const TabLabel: React.FC<React.PropsWithChildren<LabelProps>> = ({
  left,
  right,
  count,
  children,
}) => {
  return (
    <>
      {children}
      {count ? (
        <Tooltip
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
};
TabLabel.defaultProps = defaultProps;
export { TabLabel };

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
const TipLabel: React.FC<React.PropsWithChildren<LabelProps>> = ({
  count,
  left,
  right,
}) => {
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
};
TipLabel.defaultProps = defaultProps;
export { TipLabel };

const StyledCount = styled.span`
  color: #004fff;
  margin-left: 0.2857rem;
`;
const StyledTextWrapper = styled.span`
  .count {
    color: #ffffff;
  }
`;
