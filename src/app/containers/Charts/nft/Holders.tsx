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
import { xAxisCustomLable } from 'utils/hooks/useHighcharts';

export function Holders({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'holders',
    title: t(translations.highcharts.nft.holders.title),
    subtitle: t(translations.highcharts.nft.holders.subtitle),
    request: {
      url: OPEN_API_URLS.nftHolders,
      query: {
        intervalType: 'month',
        limit: 2000,
      },
      formatter: data => {
        const data1: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.total)]);
        });

        return [data1];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.nft.holders.title),
      },
      xAxis: {
        type: 'datetime',
        ...xAxisCustomLable,
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.nft.holders.yAxisTitle),
        },
        tickAmount,
      },
      tooltip: {
        shared: true,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.nft.holders.seriesName,
          )}</span>`,
        },
      ],
      navigator: {
        xAxis: {
          ...xAxisCustomLable,
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
