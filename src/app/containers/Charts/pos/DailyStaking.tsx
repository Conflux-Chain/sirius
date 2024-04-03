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

export function DailyStaking({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'daily-staking',
    title: t(translations.highcharts.pos.dailyStaking.title),
    subtitle: t(translations.highcharts.pos.dailyStaking.subtitle),
    request: {
      url: OPEN_API_URLS.PoSDailyStaking,
      formatter: data => {
        return [
          data?.list?.map((d, i) => {
            return [dayjs.utc(d.statDay).valueOf(), Number(d.v)];
          }),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.dailyStaking.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.dailyStaking.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.dailyStaking.seriesName,
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
