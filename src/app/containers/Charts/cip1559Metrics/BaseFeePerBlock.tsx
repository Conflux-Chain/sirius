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
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.timestamp * 1000).valueOf();
          data1.push([t, Number(new BigNumber(d.baseFee).div(1e9).toNumber())]);
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
        optionShow: false,
      },
      title: {
        text: t(translations.highcharts.burntFeesAnalysis.BaseFeePerBlock),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
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
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
