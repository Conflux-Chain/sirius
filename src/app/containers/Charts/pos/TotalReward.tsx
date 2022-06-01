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

export function TotalReward({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'total-reward',
    title: t(translations.highcharts.pos.totalReward.title),
    subtitle: t(translations.highcharts.pos.totalReward.subtitle),
    request: {
      url: OPEN_API_URLS.PoSTotalReward,
      formatter: data => {
        return [
          data?.list?.map((d, i) => {
            return [dayjs.utc(d.day).valueOf(), Number(d.v)];
          }),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.totalReward.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.totalReward.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
        valueSuffix: ' CFX',
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.totalReward.seriesName,
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
