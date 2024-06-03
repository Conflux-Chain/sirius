// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import BigNumber from 'bignumber.js';

export function DailyRewardRank({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.PoSDailyRewardRank,
      query: {
        day: '1',
        limit: '30',
      },
      formatter: data => {
        return data?.list
          ?.sort((a, b) => b.reward - a.reward)
          .map((d, i) => {
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
      header: {
        optionShow: false,
        title: {
          text: t(translations.highcharts.pos.dailyRewardRank.title),
        },
        subtitle: {
          text: t(translations.highcharts.pos.dailyRewardRank.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pos.breadcrumb.charts),
            path: '/pos-charts',
          },
          {
            name: t(
              translations.highcharts.pos.breadcrumb['daily-reward-rank'],
            ),
            path: '/pos-charts/daily-reward-rank',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pos.dailyRewardRank.title),
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

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
