// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate, ChildProps } from 'app/components/Charts/ChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function DailyRewardRank({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'daily-reward-rank',
    title: t(translations.highcharts.pos.dailyRewardRank.title),
    subtitle: t(translations.highcharts.pos.dailyRewardRank.subtitle),
    request: {
      url: OPEN_API_URLS.PoSDailyRewardRank,
      query: {
        day: 1,
        limit: 100,
      },
      formatter: data => {
        return data?.list
          ?.map((d, i) => {
            return {
              y: new BigNumber(d.reward).div(1e18).toNumber(),
              info: {
                PoSAddress: d.accountInfo.hex,
                PoWAddress: d.accountInfo.powBase32,
              },
            };
          })
          .map((d, i) => ({
            ...d,
            name: String(i + 1),
          }));
      },
    },
    options: {
      chart: {
        type: 'column',
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.dailyRewardRank.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.dailyRewardRank.yAxisTitle),
        },
      },
      tooltip: {
        headerFormat: '',
        pointFormat: `${t(
          translations.highcharts.pos.dailyRewardRank.PoSAddress,
        )}: <b>{point.info.PoSAddress}</b><br/>${t(
          translations.highcharts.pos.dailyRewardRank.PoWAddress,
        )}: <b>{point.info.PoWAddress}</b>
          <br/>${t(
            translations.highcharts.pos.dailyRewardRank.reward,
          )}: <b>{point.y:.2f}</b>
        `,
      },
      series: [
        {
          name: `<span>${t(
            translations.highcharts.pos.dailyRewardRank.seriesName,
          )}</span>`,
        },
      ],
    },
  };

  return (
    <Wrapper {...props}>
      <ChartTemplate {...props}></ChartTemplate>
    </Wrapper>
  );
}
