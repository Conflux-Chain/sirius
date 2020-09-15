import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { PanelContext } from './Panel';
import styled from 'styled-components';
import numeral from 'numeral';

const StyledContainer = styled.div`
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
  font-weight: bold;
  color: #0054fe;
  line-height: 24px;
  padding: 0 5px;
`;

function PanelTip({ tipsShow }) {
  const data = useContext(PanelContext);
  const { t } = useTranslation();

  if (!tipsShow) return null;

  return (
    <StyledContainer>
      {t(translations.blocksAndTransactions.totalBefore)}
      <StyledSpan>{numeral(data.total).format('0,0')}</StyledSpan>
      {t(translations.blocksAndTransactions.totalAfter, {
        type: data.type,
      })}
    </StyledContainer>
  );
}

PanelTip.defaultProps = {
  tipsShow: true,
};

PanelTip.propTypes = {
  tipsShow: PropTypes.bool,
};

export default PanelTip;
