import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import { useChartQueryParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useChartQueryParams';

export function Tx({ preview = false }: ChildProps) {
  const { t } = useTranslation();
  const query = useChartQueryParams({
    preview,
    withoutToday: true,
  });

  const props = {
    request: {
      url: OPEN_API_URLS.tx,
      query: query,
      formatter: data => {
        return [
          data?.list?.map(s => [
            // @ts-ignore
            dayjs.utc(s.statTime).valueOf(),
            // @ts-ignore
            Number(s.count),
          ]),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.pow.tx.title),
        },
        subtitle: {
          text: t(translations.highcharts.pow.tx.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pow.breadcrumb.charts),
            path: '/pow-charts',
          },
          {
            name: t(translations.highcharts.pow.breadcrumb.tx),
            path: '/pow-charts/tx',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pow.tx.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pow.tx.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(translations.highcharts.pow.tx.seriesName)}</span>`,
        },
      ],
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
