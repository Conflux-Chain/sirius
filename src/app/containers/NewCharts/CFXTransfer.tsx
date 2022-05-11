import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';
import { StockChartTemplate, ChildProps } from './StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function CFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'cfx-transfer',
    title: t(translations.highcharts.cfxTransfer.title),
    subtitle: t(translations.highcharts.cfxTransfer.subtitle),
    request: {
      url: OPEN_API_URLS.cfxTransfer,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.transferCount)]);
          data2.push([t, Number(d.userCount)]);
          data3.push([t, new BigNumber(d.amount).div(1e18).toNumber()]);
        });

        return [data1, data2, data3];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.cfxTransfer.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      legend: {
        enabled: !preview,
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.cfxTransfer.yAxisTitle),
          },
          height: '50%',
          opposite: false,
        },
        {
          title: {
            text: t(translations.highcharts.cfxTransfer.yAxisTitle3),
          },
          height: '50%',
          top: '50%',
          offset: 0,
          opposite: false,
        },
      ],
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName,
          )}</span> ]`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName2,
          )}</span> ]`,
        },
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.cfxTransfer.seriesName3,
          )}</span> ]`,
          color: '#7cb5ec',
          yAxis: 1,
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
