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

export function Contract({
  preview = false,
  address,
}: ChildProps & { address: string }) {
  const { t } = useTranslation();

  const props = {
    plain: true,
    preview: preview,
    name: '',
    title: t(translations.highcharts.pow.contract.title),
    subtitle: t(translations.highcharts.pow.contract.subtitle),
    request: {
      url: OPEN_API_URLS.contract,
      query: {
        address,
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.tx)]);
          data2.push([t, Number(d.cfxTransfer)]);
          data3.push([t, Number(d.tokenTransfer)]);
        });

        return [data1, data2, data3];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
        type: 'line',
      },
      title: {
        text: t(translations.highcharts.pow.contract.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pow.contract.yAxisTitle),
        },
      },
      series: [
        {
          name: `<span>${t(
            translations.highcharts.pow.contract.seriesName,
          )}</span>`,
        },
        {
          name: `<span>${t(
            translations.highcharts.pow.contract.seriesName2,
          )}</span>`,
        },
        {
          name: `<span>${t(
            translations.highcharts.pow.contract.seriesName3,
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
