import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function AveragePriorityFeePerBlock({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.averagePriorityFeePerBlock,
      query: {
        intervalType: 'day',
        limit: '2000',
      },
      formatter: data => {
        const data1: any = [];
        const timestamps = new Set();

        data?.list?.map(d => {
          let t = dayjs.utc(d.timestamp * 1000).valueOf();
          while (timestamps.has(t)) {
            t += 1;
          }

          timestamps.add(t);
          data1.push([t, Number(d.avgPriorityFee)]);
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
        text: t(
          translations.highcharts.burntFeesAnalysis.AveragePriorityFeePerBlock,
        ),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },
      navigator: {
        enabled: false,
      },
      scrollbar: {
        enabled: false,
      },
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis['AveragePriorityFee'],
          )}</span>`,
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
