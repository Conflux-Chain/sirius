import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function FinalizedInterval({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.PoSFinalizedInterval,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, Number(d.finalize_second_gap)]);
          data2.push([t, Number(d.finalize_epoch_gap)]);
        });

        return [data1, data2];
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
            name: t(
              translations.highcharts.pos.breadcrumb['finalized-interval'],
            ),
            path: '/pos-charts/finalized-interval',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.finalizedInterval.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.finalizedInterval.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.finalizedInterval.seriesName,
          )}</span>`,
          tooltip: {
            valueSuffix: 's',
          },
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.finalizedInterval.seriesName2,
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
