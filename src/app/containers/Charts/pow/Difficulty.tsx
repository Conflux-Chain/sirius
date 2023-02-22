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

export function Difficulty({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'difficulty',
    preview,
    title: t(translations.highcharts.pow.difficulty.title),
    subtitle: t(translations.highcharts.pow.difficulty.subtitle),
    request: {
      url: OPEN_API_URLS.mining,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs.utc(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.difficulty) / 1000000000000, // format to TH
        ]),
      ],
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pow.difficulty.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pow.difficulty.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      series: [
        {
          type: 'area',
          name: `<span>${t(
            translations.highcharts.pow.difficulty.seriesName,
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
