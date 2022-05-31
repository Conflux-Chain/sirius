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

export function ActiveAccounts({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'active-accounts',
    title: t(translations.highcharts.pow.activeAccounts.title),
    subtitle: t(translations.highcharts.pow.activeAccounts.subtitle),
    request: {
      url: OPEN_API_URLS.activeAccounts,
      formatter: data => {
        return [
          data?.list?.map(s => [
            // @ts-ignore
            dayjs.utc(s.statTime).valueOf(),
            // @ts-ignore
            Number(s.count),
          ]),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pow.activeAccounts.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pow.activeAccounts.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pow.activeAccounts.seriesName,
          )}</span>`,
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
