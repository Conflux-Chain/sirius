import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { toThousands } from '../../../utils';

interface LabelProps {
  left?: string;
  right?: string;
  total?: number | null;
  realTotal?: number;
  showTooltip?: boolean;
}

const defaultProps = {
  left: '',
  right: '',
  total: 0,
  realTotal: 0,
  showTooltip: true,
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
  showTooltip,
}) => {
  return (
    <>
      {children}
      {total ? (
        showTooltip ? (
          <Tooltip
            title={
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
          <StyledCount>({total > 9999 ? '9999+' : total})</StyledCount>
        )
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
  margin: 1.2rem 0 1.6rem;
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
    if (total != null) setCount(total);
  }, [total]);
  return (
    <StyledTipLabelWrapper>
      {left}
      {total !== null && <StyledSpan>{toThousands(number)}</StyledSpan>}
      {right}
    </StyledTipLabelWrapper>
  );
};
TipLabel.defaultProps = defaultProps;
export { TipLabel };

const StyledCount = styled.span`
  color: #004fff;
  margin-left: 5px;
  font-size: 12px;
`;
const StyledTextWrapper = styled.span`
  .total {
    color: #ffffff;
  }
`;
