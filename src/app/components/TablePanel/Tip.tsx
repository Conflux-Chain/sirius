import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { PanelContext } from './Panel';
import styled from 'styled-components';
import currency from 'currency.js';

const StyledWrapper = styled.div`
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

function PanelTip({ show }) {
  const data = useContext(PanelContext);
  const { t } = useTranslation();

  if (!show) return null;

  return (
    <StyledWrapper>
      {t(translations.blocksAndTransactions.totalBefore)}
      <StyledSpan>
        {currency(data.total, { symbol: '', precision: 0 }).format()}
      </StyledSpan>
      {t(translations.blocksAndTransactions.totalAfter, {
        type: data.type,
      })}
    </StyledWrapper>
  );
}

PanelTip.defaultProps = {
  show: true,
};

PanelTip.propTypes = {
  show: PropTypes.bool,
};

export default PanelTip;
