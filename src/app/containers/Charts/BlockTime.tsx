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

export function BlockTime({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'blocktime',
    title: t(translations.highcharts.averageBlockTime.title),
    subtitle: t(translations.highcharts.averageBlockTime.subtitle),
    request: {
      url: OPEN_API_URLS.mining,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs.utc(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.blockTime),
        ]),
      ],
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.averageBlockTime.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.averageBlockTime.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.averageBlockTime.seriesName,
          )}</span>`,
          tooltip: {
            valueSuffix: 's',
          },
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
