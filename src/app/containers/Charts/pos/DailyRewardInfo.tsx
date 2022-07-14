import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function DailyRewardInfo({ preview = false }: ChildProps) {
  const { t } = useTranslation();

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
          data1.push([
            t,
            Number(new BigNumber(d.totalReward).div(1e18).toFixed(2)),
          ]);
          data2.push([
            t,
            Number(new BigNumber(d.avgReward).div(1e18).toFixed(2)),
          ]);
          data3.push([t, Number(d.rewardAccounts)]);
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
          height: '50%',
          opposite: false,
        },
        {
          title: {
            text: t(translations.highcharts.pos.dailyRewardInfo.yAxisTitle3),
          },
          height: '50%',
          top: '50%',
          offset: 0,
          opposite: false,
        },
      ],
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardInfo.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardInfo.seriesName2,
          )}</span>`,
        },
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
      ],
    },
  };

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
