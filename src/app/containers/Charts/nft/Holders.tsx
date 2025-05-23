import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import {
  ChildProps,
  xAxisCustomLabelYear,
} from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { scope } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function Holders({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    request: {
      url: OPEN_API_URLS.nftHolders,
      query: {
        intervalType: 'month',
        limit: preview ? '30' : '2000',
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
        marginRight: 30,
      },
      header: {
        title: {
          text: t(translations.highcharts.nft.holders.title),
        },
        subtitle: {
          text: t(translations.highcharts.nft.holders.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.nft.breadcrumb.charts),
            path: '/nft-charts',
          },
          {
            name: t(translations.highcharts.nft.breadcrumb.holders),
            path: '/nft-charts/holders',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.nft.holders.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
        ...xAxisCustomLabelYear,
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
          ...xAxisCustomLabelYear,
        },
      },
      intervalScope: {
        month: scope.month,
        day: scope.day,
      },
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
