import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';
import { StockChartTemplate, ChildProps } from './StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';

export function AccountGrowth({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'account-growth',
    title: t(translations.highcharts.accountGrowth.title),
    subtitle: t(translations.highcharts.accountGrowth.subtitle),
    request: {
      url: OPEN_API_URLS.accountGrowth,
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
        text: t(translations.highcharts.accountGrowth.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      legend: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.accountGrowth.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `[ <span style="color:rgb(124, 181, 236);">${t(
            translations.highcharts.accountGrowth.seriesName,
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
