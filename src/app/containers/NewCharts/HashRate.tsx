import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';
import { StockChartTemplate } from './StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Space } from '@cfxjs/antd';

export function HashRate() {
  const { t } = useTranslation();

  const props = {
    title: t(translations.highcharts.hashRate.title),
    subtitle: t(translations.highcharts.hashRate.subtitle),
    request: {
      url: OPEN_API_URLS.mining,
      query: { limit: 100, intervalType: 'day', sort: 'ASC' },
      formatter: data =>
        data?.list?.map(s => [
          // @ts-ignore
          dayjs(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.hashRate) / 1000000000, // format to GH/s
        ]),
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.hashRate.title),
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
          text: t(translations.highcharts.hashRate.yAxisTitle),
        },
      },
      series: [
        {
          type: 'area',
          name: `[ <span style="color:rgb(124, 181, 236);">${t(
            translations.highcharts.hashRate.seriesName,
          )}</span> ]`,
        },
      ],
    },
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <StockChartTemplate {...props}></StockChartTemplate>
      <ChartTemplate {...props}></ChartTemplate>
    </Space>
  );
}
