import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  useBurntFeesStatistics,
  useWCFXTokenInfo,
} from '../../../../utils/api';

export function StatisticsDatas() {
  const { t } = useTranslation();
  const { data } = useBurntFeesStatistics({});
  const wcfxToken = useMemo(
    () => ({
      contracts: 'cfxtest:achs3nehae0j6ksvy1bhrffsh1rtfrw1f6w1kzv46t',
    }),
    [],
  );
  const { data: token } = useWCFXTokenInfo(wcfxToken);

  const totalBurntFees =
    (Number(data?.list[0].burntStorageFeeTotal) +
      Number(data?.list[0].burntGasFeeTotal)) /
    1e18;

  const marketCap = useMemo(() => {
    if (totalBurntFees && token) {
      return totalBurntFees * token[0].priceInUSDT;
    }
    return 0;
  }, [totalBurntFees, token]);

  return (
    <StatisticsDataWrapper>
      <StatisticsData>
        <div className="title">
          {t(translations.highcharts.burntFeesAnalysis.totalBurntFees)}
        </div>
        <div className="data">{totalBurntFees.toFixed(2)}</div>
        <div className="symbol">CFX</div>
      </StatisticsData>
      <StatisticsData>
        <div className="title">
          {t(translations.highcharts.burntFeesAnalysis.marketCap)}
        </div>
        <div className="data">{marketCap.toFixed(2)}</div>
        <div className="symbol">USD</div>
      </StatisticsData>
    </StatisticsDataWrapper>
  );
}

const StatisticsDataWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatisticsData = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #fff;
  text-align: center;
  font-family: 'Circular Std';

  .title {
    font-size: 20px;
    color: #26244b99;
    font-weight: 450;
    line-height: 28px;
  }
  .data {
    font-size: 36px;
    font-weight: 700;
    color: #282d30;
    line-height: 44px;
  }
  .symbol {
    font-size: 24px;
    font-weight: 700;
    color: #282d30;
    line-height: 44px;
  }
`;
