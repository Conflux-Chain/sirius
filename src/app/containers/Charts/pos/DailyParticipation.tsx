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

export function DailyParticipation({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'participation-rate',
    title: t(translations.highcharts.pos.participation.title),
    subtitle: t(translations.highcharts.pos.participation.subtitle),
    request: {
      url: OPEN_API_URLS.PoSDailyParticipationRate,
      formatter: data => {
        return [
          data?.list?.map((d, i) => {
            return [
              dayjs.utc(d.day).valueOf(),
              Number(new BigNumber(d.v).toFixed(2)),
            ];
          }),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.participation.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.participation.yAxisTitle),
        },
      },
      tooltip: {
        valueSuffix: '%',
      },
      series: [
        {
          type: 'area',
          name: `<span>${t(
            translations.highcharts.pos.participation.seriesName,
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
