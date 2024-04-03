import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function DailyCFXTransfer({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'daily-cfx-transfer',
    title: t(translations.highcharts.crossSpace.dailyCFXTransfer.title),
    subtitle: t(translations.highcharts.crossSpace.dailyCFXTransfer.subtitle),
    request: {
      url: OPEN_API_URLS.CrossSpaceDailyCFXTransfer,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, Number(new BigNumber(d.DailyCfxToEVM).toFixed(2))]);
          data2.push([t, Number(new BigNumber(d.DailyCfxFromEVM).toFixed(2))]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.crossSpace.dailyCFXTransfer.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(
            translations.highcharts.crossSpace.dailyCFXTransfer.yAxisTitle,
          ),
        },
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.crossSpace.dailyCFXTransfer.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.crossSpace.dailyCFXTransfer.seriesName2,
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
