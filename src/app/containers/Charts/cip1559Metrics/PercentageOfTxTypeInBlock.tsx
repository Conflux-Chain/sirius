import React from 'react';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function PercentageOfTxTypeInBlock({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.percentageOfTxTypeInBlock,
      query: {
        intervalType: 'day',
        limit: '2000',
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        data?.list?.forEach((d, i) => {
          const cip1559 = new BigNumber(d.txsInType.cip1559 || 0);
          const cip2930 = new BigNumber(d.txsInType.cip2930 || 0);
          const legacy = new BigNumber(d.txsInType.legacy || 0);

          const total = cip1559.plus(cip2930).plus(legacy);

          const cip1559Percentage = total.isZero()
            ? 0
            : cip1559.div(total).times(100).toNumber();
          const cip2930Percentage = total.isZero()
            ? 0
            : cip2930.div(total).times(100).toNumber();
          const legacyPercentage = total.isZero()
            ? 0
            : legacy.div(total).times(100).toNumber();
          const name = dayjs(d.timestamp * 1000).format(
            'dddd MMM DD, HH:mm:ss',
          );

          data1.push({
            x: d.epochNumber * 10000 + d.blockIndex,
            y: cip1559Percentage,
            name,
          });
          data2.push({
            x: d.epochNumber * 10000 + d.blockIndex,
            y: cip2930Percentage,
            name,
          });
          data3.push({
            x: d.epochNumber * 10000 + d.blockIndex,
            y: legacyPercentage,
            name,
          });
        });

        return [data1, data2, data3];
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
        text: t(
          translations.highcharts.burntFeesAnalysis.PercentageOfTxTypeInBlock,
        ),
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
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          format: '{value}%',
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      rangeSelector: {
        enabled: false,
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },
      series: [
        {
          type: 'column',
          name: `<span>CIP-1559</span>`,
          color: '#7cb5ec',
          tooltip: {
            valueSuffix: ' %',
          },
          turboThreshold: 2000,
        },
        {
          type: 'column',
          name: `<span>CIP-2930</span>`,
          color: '#434348',
          tooltip: {
            valueSuffix: ' %',
          },
          turboThreshold: 2000,
        },
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis.Legacy,
          )}</span>`,
          tooltip: {
            valueSuffix: ' %',
          },
          color: '#90ed7d',
          turboThreshold: 2000,
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
