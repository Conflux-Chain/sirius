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
        const timestamps = new Set();

        data?.list?.forEach(d => {
          let t = dayjs.utc(d.timestamp * 1000).valueOf();
          while (timestamps.has(t)) {
            t += 1;
          }
          timestamps.add(t);

          const cip1559 = new BigNumber(d.txsInType.cip1559 || 0);
          const cip2930 = new BigNumber(d.txsInType.cip2930 || 0);
          const legacy = new BigNumber(d.txsInType.legacy || 0);

          const total = cip1559.plus(cip2930).plus(legacy);

          const cip1559Percentage = cip1559.div(total).times(100).toNumber();
          const cip2930Percentage = cip2930.div(total).times(100).toNumber();
          const legacyPercentage = legacy.div(total).times(100).toNumber();

          data1.push([t, cip1559Percentage]);
          data2.push([t, cip2930Percentage]);
          data3.push([t, legacyPercentage]);
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
        },
        {
          type: 'column',
          name: `<span>CIP-2930</span>`,
          color: '#434348',
          tooltip: {
            valueSuffix: ' %',
          },
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
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
