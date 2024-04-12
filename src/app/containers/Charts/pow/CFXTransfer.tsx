import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function CFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    request: {
      url: OPEN_API_URLS.cfxTransfer,
      query: preview
        ? {
            limit: '30',
            intervalType: 'day',
          }
        : undefined,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, new BigNumber(d.amount).div(1e18).toNumber()]);
          data2.push([t, Number(d.userCount)]);
          data3.push([t, Number(d.transferCount)]);
        });

        return [data1, data2, data3];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        title: {
          text: t(translations.highcharts.pow.cfxTransfer.title),
        },
        subtitle: {
          text: t(translations.highcharts.pow.cfxTransfer.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pow.breadcrumb.charts),
            path: '/pow-charts',
          },
          {
            name: t(translations.highcharts.pow.breadcrumb['cfx-transfer']),
            path: '/pow-charts/cfx-transfer',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pow.cfxTransfer.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.pow.cfxTransfer.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.pow.cfxTransfer.yAxisTitle3),
          },
          opposite: true,
          tickAmount,
        },
      ],
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName3,
          )}</span>`,
          yAxis: 1,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' CFX',
          },
          color: '#7cb5ec',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName2,
          )}</span>`,
          color: '#90ed7d',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName,
          )}</span>`,
          color: '#434348',
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
