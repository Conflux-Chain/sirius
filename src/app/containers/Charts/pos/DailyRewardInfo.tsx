import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';
import { useChartQueryParams } from '@cfxjs/sirius-next-common/dist/utils/hooks/useChartQueryParams';

export function DailyRewardInfo({ preview = false }: ChildProps) {
  const { t } = useTranslation();
  const query = useChartQueryParams({
    preview,
  });

  const tickAmount = preview ? 4 : 6;

  const props = {
    request: {
      url: OPEN_API_URLS.PoSDailyRewardInfo,
      query: query,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        // TODO, data order issue, need to change by open api
        data?.list.reverse().map((d, i) => {
          const t = dayjs.utc(d.statDay).valueOf();
          data1.push([t, Number(d.rewardAccounts)]);
          data2.push([
            t,
            Number(new BigNumber(d.avgReward).div(1e18).toFixed(2)),
          ]);
          data3.push([
            t,
            Number(new BigNumber(d.totalReward).div(1e18).toFixed(2)),
          ]);
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
          text: t(translations.highcharts.pos.dailyRewardInfo.title),
        },
        subtitle: {
          text: t(translations.highcharts.pos.dailyRewardInfo.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pos.breadcrumb.charts),
            path: '/pos-charts',
          },
          {
            name: t(
              translations.highcharts.pos.breadcrumb['daily-reward-info'],
            ),
            path: '/pos-charts/daily-reward-info',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.dailyRewardInfo.title),
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
            text: t(translations.highcharts.pos.dailyRewardInfo.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.pos.dailyRewardInfo.yAxisTitle3),
          },
          opposite: true,
          tickAmount,
        },
      ],
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardInfo.seriesName3,
          )}</span>`,
          color: '#7cb5ec',
          yAxis: 1,
          // tooltip: {
          //   // valueDecimals: 2,
          //   // valueSuffix: ' CFX',
          // },
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardInfo.seriesName2,
          )}</span>`,
          color: '#434348',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardInfo.seriesName,
          )}</span>`,
          color: '#90ed7d',
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
