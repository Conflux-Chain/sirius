import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';
import { StockChartTemplate, ChildProps } from './StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';

export function Difficulty({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'difficulty',
    preview,
    title: t(translations.highcharts.difficulty.title),
    subtitle: t(translations.highcharts.difficulty.subtitle),
    request: {
      url: OPEN_API_URLS.mining,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs(s.statTime).valueOf(),
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
        text: t(translations.highcharts.difficulty.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      legend: {
        enabled: false,
      },
      // tooltip: {
      //   pointFormat: '{series.name}: <b>{point.y}</b><br/>',
      //   valueDecimals: 2,
      // },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.difficulty.yAxisTitle),
        },
      },
      series: [
        {
          type: 'area',
          name: `[ <span style="color:rgb(124, 181, 236);">${t(
            translations.highcharts.difficulty.seriesName,
          )}</span> ]`,
        },
      ],
    },
  };

  return (
    <Wrapper {...props}>
      {localStorage.getItem('USE-STOCK') === 'true' ? (
        <StockChartTemplate {...props}></StockChartTemplate>
      ) : (
        <ChartTemplate {...props}></ChartTemplate>
      )}
    </Wrapper>
  );
}
