import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function DailyDeposit({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 5 : 7;

  const props = {
    request: {
      url: OPEN_API_URLS.PoSDailyDeposit,
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
          data1.push([t, Number(new BigNumber(d.staking_deposit).toFixed(2))]);
          data2.push([t, Number(new BigNumber(d.staking_withdraw).toFixed(2))]);
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
          text: t(translations.highcharts.pos.dailyDeposit.title),
        },
        subtitle: {
          text: t(translations.highcharts.pos.dailyDeposit.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pos.breadcrumb.charts),
            path: '/pos-charts',
          },
          {
            name: t(translations.highcharts.pos.breadcrumb['daily-deposit']),
            path: '/pos-charts/daily-deposit',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.dailyDeposit.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.pos.dailyDeposit.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.pos.dailyDeposit.yAxisTitle2),
          },
          opposite: true,
          tickAmount,
        },
      ],
      tooltip: {
        valueSuffix: ' CFX',
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyDeposit.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyDeposit.seriesName2,
          )}</span>`,
          yAxis: 1,
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
