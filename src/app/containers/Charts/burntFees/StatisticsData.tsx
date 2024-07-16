import React, { useMemo } from 'react';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  useBurntFeesStatistics,
  useWCFXTokenInfo,
} from '../../../../utils/api';
import { toThousands } from '@cfxjs/sirius-next-common/dist/utils';

export function StatisticsDatas() {
  const { t } = useTranslation();
  const { data } = useBurntFeesStatistics();

  const { data: token } = useWCFXTokenInfo();

  const list = data?.list.reduce((max, current) => {
    const maxTime = new Date(max.statTime).getTime();
    const currentTime = new Date(current.statTime).getTime();
    return currentTime > maxTime ? current : max;
  }, data?.list[0]);

  const totalBurntFees = list
    ? new BigNumber(list.burntStorageFeeTotal)
        .plus(new BigNumber(list.burntGasFeeTotal))
        .dividedBy(new BigNumber(1e18))
    : new BigNumber(0);

  const marketCap = useMemo(() => {
    if (totalBurntFees.isGreaterThan(0) && token) {
      return totalBurntFees.multipliedBy(new BigNumber(token[0].priceInUSDT));
    }
    return new BigNumber(0);
  }, [totalBurntFees, token]);

  return (
    <StatisticsDataWrapper>
      <StatisticsData>
        <div className="title">
          {t(translations.highcharts.burntFeesAnalysis.totalBurntFees)}
        </div>
        <div className="data">{toThousands(totalBurntFees.toFixed(2))}</div>
        <div className="symbol">CFX</div>
      </StatisticsData>
      <StatisticsData>
        <div className="title">
          {t(translations.highcharts.burntFeesAnalysis.marketCap)}
        </div>
        <div className="data">{toThousands(marketCap.toFixed(2))}</div>
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
