import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function DailyRewardInfo({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'daily-reward-info',
    title: t(translations.highcharts.pos.dailyRewardInfo.title),
    subtitle: t(translations.highcharts.pos.dailyRewardInfo.subtitle),
    request: {
      url: OPEN_API_URLS.PoSDailyRewardInfo,
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
      title: {
        text: t(translations.highcharts.pos.dailyRewardInfo.title),
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

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
