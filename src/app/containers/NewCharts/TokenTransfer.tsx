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

export function TokenTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'token-transfer',
    title: t(translations.highcharts.tokenTransfer.title),
    subtitle: t(translations.highcharts.tokenTransfer.subtitle),
    request: {
      url: OPEN_API_URLS.tokenTransfer,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.transferCount)]);
          data2.push([t, Number(d.userCount)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.tokenTransfer.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      // legend: {
      //   enabled: !preview,
      // },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.tokenTransfer.yAxisTitle),
        },
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.tokenTransfer.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.tokenTransfer.seriesName2,
          )}</span>`,
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
