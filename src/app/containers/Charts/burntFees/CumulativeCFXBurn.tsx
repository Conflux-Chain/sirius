import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function CumulativeCFXBurn({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.cumulativeCFXBurn,
      query: {
        intervalType: 'day',
        limit: '365',
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([
            t,
            Number(new BigNumber(d.burntGasFeeTotal).div(1e18).toNumber()),
          ]);
          data2.push([
            t,
            Number(new BigNumber(d.burntStorageFeeTotal).div(1e18).toNumber()),
          ]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        titleShow: false,
        breadcrumbShow: false,
      },
      title: {
        text: t(translations.highcharts.burntFeesAnalysis.cumulativeCFXBurn),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis['1559MetricsBurn'],
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis['storageBurn'],
          )}</span>`,
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
