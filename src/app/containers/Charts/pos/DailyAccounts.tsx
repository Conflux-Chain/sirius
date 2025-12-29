import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import { useChartQueryParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useChartQueryParams';

export function DailyAccounts({ preview = false }: ChildProps) {
  const { t } = useTranslation();
  const query = useChartQueryParams({
    preview,
  });

  const props = {
    request: {
      url: OPEN_API_URLS.PoSDailyAccounts,
      query: query,
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
          text: t(translations.highcharts.pos.dailyAccounts.title),
        },
        subtitle: {
          text: t(translations.highcharts.pos.dailyAccounts.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pos.breadcrumb.charts),
            path: '/pos-charts',
          },
          {
            name: t(translations.highcharts.pos.breadcrumb['daily-accounts']),
            path: '/pos-charts/daily-accounts',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.dailyAccounts.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.dailyAccounts.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyAccounts.seriesName,
          )}</span>`,
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
