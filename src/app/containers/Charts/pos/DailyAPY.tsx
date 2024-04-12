import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function DailyAPY({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.PoSDailyAPY,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        return [
          data?.list?.map((d, i) => {
            return [dayjs.utc(d.day).valueOf(), Number(d.v)];
          }),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.pos.apy.title),
        },
        subtitle: {
          text: t(translations.highcharts.pos.apy.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pos.breadcrumb.charts),
            path: '/pos-charts',
          },
          {
            name: t(translations.highcharts.pos.breadcrumb['daily-apy']),
            path: '/pos-charts/daily-apy',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.apy.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.apy.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
        valueSuffix: '%',
      },
      series: [
        {
          type: 'area',
          name: `<span>${t(translations.highcharts.pos.apy.seriesName)}</span>`,
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
