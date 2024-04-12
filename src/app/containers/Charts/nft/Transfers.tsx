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

export function Transfers({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const tickAmount = preview ? 4 : 6;

  const props = {
    preview: preview,
    name: 'transfers',
    title: t(translations.highcharts.nft.transfers.title),
    subtitle: t(translations.highcharts.nft.transfers.subtitle),
    request: {
      url: OPEN_API_URLS.nftTransfers,
      query: {
        intervalType: 'month',
        limit: preview ? '30' : '2000',
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
      header: {
        title: {
          text: t(translations.highcharts.nft.transfers.title),
        },
        subtitle: {
          text: t(translations.highcharts.nft.transfers.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.nft.breadcrumb.charts),
            path: '/nft-charts',
          },
          {
            name: t(translations.highcharts.nft.breadcrumb.transfers),
            path: '/nft-charts/transfers',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.nft.transfers.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
        ...xAxisCustomLabelYear,
      },
      yAxis: [
        {
          title: {
            text: t(translations.highcharts.nft.transfers.yAxisTitle),
          },
          opposite: false,
          tickAmount,
        },
        {
          title: {
            text: t(translations.highcharts.nft.transfers.yAxisTitle2),
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
            translations.highcharts.nft.transfers.seriesName,
          )}</span>`,
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.nft.transfers.seriesName2,
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
