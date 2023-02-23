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
import BigNumber from 'bignumber.js';

export function CFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'cfx-transfer',
    title: t(translations.highcharts.pow.cfxTransfer.title),
    subtitle: t(translations.highcharts.pow.cfxTransfer.subtitle),
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
        text: t(translations.highcharts.pow.cfxTransfer.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.pow.cfxTransfer.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.pow.cfxTransfer.yAxisTitle3),
          },
          opposite: true,
          tickAmount,
        },
      ],
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName,
          )}</span>`,
          color: '#434348',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName2,
          )}</span>`,
          color: '#90ed7d',
        },
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.pow.cfxTransfer.seriesName3,
          )}</span>`,
          yAxis: 1,
          tooltip: {
            valueDecimals: 2,
            valueSuffix: ' CFX',
          },
          color: '#7cb5ec',
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
