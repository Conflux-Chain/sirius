import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function DailyCFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.CrossSpaceDailyCFXTransfer,
      query: {
        intervalType: 'day',
        limit: preview ? '30' : '365',
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, Number(new BigNumber(d.DailyCfxToEVM).toFixed(2))]);
          data2.push([t, Number(new BigNumber(d.DailyCfxFromEVM).toFixed(2))]);
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
          text: t(translations.highcharts.crossSpace.dailyCFXTransfer.title),
        },
        subtitle: {
          text: t(translations.highcharts.crossSpace.dailyCFXTransfer.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.crossSpace.breadcrumb.charts),
            path: '/cross-space-charts',
          },
          {
            name: t(
              translations.highcharts.crossSpace.breadcrumb[
                'daily-cfx-transfer'
              ],
            ),
            path: '/cross-space-charts/daily-cfx-transfer',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.crossSpace.dailyCFXTransfer.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(
            translations.highcharts.crossSpace.dailyCFXTransfer.yAxisTitle,
          ),
        },
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.crossSpace.dailyCFXTransfer.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.crossSpace.dailyCFXTransfer.seriesName2,
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
