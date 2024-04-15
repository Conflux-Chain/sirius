import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { scope } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import { xAxisCustomLabelYear } from 'utils/hooks/useHighcharts';

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
