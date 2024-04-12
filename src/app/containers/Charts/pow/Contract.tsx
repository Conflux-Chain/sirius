import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function Contract({
  preview = false,
  address,
}: ChildProps & { address: string }) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.contract,
      query: {
        limit: '30',
        intervalType: 'day',
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
      header: {
        breadcrumbShow: false,
        titleShow: false,
        title: {
          text: t(translations.highcharts.pow.contract.title),
        },
        subtitle: {
          text: t(translations.highcharts.pow.contract.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pow.breadcrumb.charts),
            path: '/pow-charts',
          },
          {
            name: t(translations.highcharts.pow.breadcrumb.blocktime),
            path: '/pow-charts/contracts',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pow.contract.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
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

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
