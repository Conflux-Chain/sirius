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
import { xAxisCustomLabelYear } from 'utils/hooks/useHighcharts';

export function Contracts({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'contracts',
    title: t(translations.highcharts.nft.contracts.title),
    subtitle: t(translations.highcharts.nft.contracts.subtitle),
    request: {
      url: OPEN_API_URLS.nftContracts,
      query: {
        intervalType: 'month',
        limit: 2000,
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.count)]);
          data2.push([t, Number(d.total)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.nft.contracts.title),
      },
      xAxis: {
        type: 'datetime',
        ...xAxisCustomLabelYear,
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.nft.contracts.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.nft.contracts.yAxisTitle2),
          },
          opposite: true,
          tickAmount,
        },
      ],
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.nft.contracts.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.nft.contracts.seriesName2,
          )}</span>`,
          yAxis: 1,
        },
      ],
      navigator: {
        baseSeries: 1,
        series: {
          color: '#7cb5ec',
        },
        xAxis: {
          ...xAxisCustomLabelYear,
        },
      },
    },
  };

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
