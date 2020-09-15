import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { PanelContext } from './Panel';

function PanelTip({ tipsShow }) {
  const data = useContext(PanelContext);
  const { t } = useTranslation();

  if (!tipsShow) return null;

  return (
    <div>
      {t(translations.blocksAndTransactions.totalBefore)} {data.total}{' '}
      {t(translations.blocksAndTransactions.totalAfter, {
        type: data.type,
      })}
    </div>
  );
}

PanelTip.defaultProps = {
  tipsShow: true,
};

PanelTip.propTypes = {
  tipsShow: PropTypes.bool,
};

export default PanelTip;
