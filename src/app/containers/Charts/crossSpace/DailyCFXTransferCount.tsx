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

export function DailyCFXTransferCount({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'daily-cfx-transfer-count',
    title: t(translations.highcharts.crossSpace.dailyCFXTransferCount.title),
    subtitle: t(
      translations.highcharts.crossSpace.dailyCFXTransferCount.subtitle,
    ),
    request: {
      url: OPEN_API_URLS.CrossSpaceDailyCFXTransfer,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([
            t,
            Number(new BigNumber(d.DailyCfxCountToEVM).toFixed(2)),
          ]);
          data2.push([
            t,
            Number(new BigNumber(d.DailyCfxCountFromEVM).toFixed(2)),
          ]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.crossSpace.dailyCFXTransferCount.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(
            translations.highcharts.crossSpace.dailyCFXTransferCount.yAxisTitle,
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
            translations.highcharts.crossSpace.dailyCFXTransferCount.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.crossSpace.dailyCFXTransferCount
              .seriesName2,
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
