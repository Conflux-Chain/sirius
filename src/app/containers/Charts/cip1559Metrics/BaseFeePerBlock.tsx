import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function BaseFeePerBlock({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.baseFeePerBlock,
      query: {
        intervalType: 'day',
        limit: '2000',
      },
      formatter: data => {
        const data1: any = [];

        data?.list?.map((d, i) => {
          data1.push({
            x: d.epochNumber * 10000 + d.blockIndex,
            y: Number(new BigNumber(d.baseFee).div(1e9).toNumber()),
            name: dayjs(d.timestamp * 1000).format('dddd MMM DD, HH:mm:ss (UTC)'),
          });
        });

        return [data1];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        titleShow: false,
        breadcrumbShow: false,
        optionShow: false,
      },
      title: {
        text: t(translations.highcharts.burntFeesAnalysis.BaseFeePerBlock),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        labels: {
          enabled: false,
        },
      },
      navigator: {
        xAxis: {
          labels: {
            enabled: false,
          },
        },
      },
      tooltip: {
        shared: true,
      },
      rangeSelector: {
        enabled: false,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis.baseFee,
          )}</span>`,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' Gdrip',
          },
          turboThreshold: 2000,
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
