import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';

export function BlockTime() {
  const { t } = useTranslation();

  return (
    <ChartTemplate
      title={t(translations.highcharts.averageBlockTime.title)}
      subtitle={t(translations.highcharts.averageBlockTime.subtitle)}
      request={{
        url: OPEN_API_URLS.mining,
        query: { limit: 100, intervalType: 'day', sort: 'ASC' },
        formatter: data =>
          data?.list?.map(s => [
            // @ts-ignore
            dayjs(s.statTime).valueOf(),
            // @ts-ignore
            Number(s.blockTime),
          ]),
      }}
      options={{
        chart: {
          zoomType: 'x',
        },
        title: {
          text: t(translations.highcharts.averageBlockTime.title),
        },
        subtitle: {
          text: t(translations.highcharts.subtitle),
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
          valueDecimals: 2,
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: t(translations.highcharts.averageBlockTime.yAxisTitle),
          },
        },
        series: [
          {
            type: 'column',
            name: `[ <span style="color:rgb(124, 181, 236);">${t(
              translations.highcharts.averageBlockTime.seriesName,
            )}</span> ]`,
          },
        ],
      }}
    ></ChartTemplate>
  );
}
