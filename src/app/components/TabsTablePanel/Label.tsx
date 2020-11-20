import React, { useState, useEffect } from 'react';
import styled from 'styled-components/macro';
import { Tooltip } from '../Tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toThousands } from '../../../utils';

interface LabelProps {
  left?: string;
  right?: string;
  total?: number;
  realTotal?: number;
}

const defaultProps = {
  left: '',
  right: '',
  total: 0,
  realTotal: 0,
};

const Text = ({ left, right, total = 0, realTotal = 0 }: LabelProps) => {
  const { t } = useTranslation();
  const translateText =
    total === realTotal
      ? translations.general.tabLabel.lt10000
      : translations.general.tabLabel.gte10000;
  return (
    <>
      {t(translateText, {
        total: toThousands(total),
        realTotal: toThousands(realTotal),
      })}
    </>
  );
};

const TabLabel: React.FC<React.PropsWithChildren<LabelProps>> = ({
  left,
  right,
  total,
  realTotal,
  children,
}) => {
  return (
    <>
      {children}
      {total ? (
        <Tooltip
          text={
            <StyledTextWrapper>
              <Text
                left={left}
                right={right}
                total={total}
                realTotal={realTotal}
              ></Text>
            </StyledTextWrapper>
          }
        >
          <StyledCount>({total > 9999 ? '9999+' : total})</StyledCount>
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
  total,
  left,
  right,
}) => {
  const [number, setCount] = useState(total);
  useEffect(() => {
    // cache total number
    if (total) setCount(total);
  }, [total]);
  return (
    <StyledTipLabelWrapper>
      {left}
      <StyledSpan>{toThousands(number)}</StyledSpan>
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
  .total {
    color: #ffffff;
  }
`;
