import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from 'app/components/Charts/ChartTemplate';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';

export function HashRate({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'hashrate',
    preview: preview,
    title: t(translations.highcharts.hashRate.title),
    subtitle: t(translations.highcharts.hashRate.subtitle),
    request: {
      url: OPEN_API_URLS.mining,
      formatter: data => [
        data?.list?.map(s => [
          // @ts-ignore
          dayjs(s.statTime).valueOf(),
          // @ts-ignore
          Number(s.hashRate) / 1000000000, // format to GH/s
        ]),
      ],
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
          name: `<span>${t(
            translations.highcharts.hashRate.seriesName,
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
