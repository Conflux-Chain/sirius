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

export function Assets({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'assets',
    title: t(translations.highcharts.nft.assets.title),
    subtitle: t(translations.highcharts.nft.assets.subtitle),
    request: {
      url: OPEN_API_URLS.nftAssets,
      query: {
        limit: preview ? 30 : 2000,
        intervalType: preview ? 'month' : 'day',
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
        text: t(translations.highcharts.nft.assets.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.nft.assets.yAxisTitle),
          },
          height: '50%',
          opposite: false,
        },
        {
          title: {
            text: t(translations.highcharts.nft.assets.yAxisTitle2),
          },
          height: '50%',
          top: '50%',
          offset: 0,
          opposite: false,
        },
      ],
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.nft.assets.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.nft.assets.seriesName2,
          )}</span>`,
          yAxis: 1,
        },
      ],
      navigator: {
        baseSeries: 1,
        series: {
          color: '#7cb5ec',
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
