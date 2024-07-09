import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';

export function BurntRateInDaoVoting({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.burntRateInDaoVoting,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = d.epochNumber;
          data1.push([t, Number(d['baseFeeShareRate'])]);
          data2.push([t, Number(d.storagePointRate)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        titleShow: false,
        breadcrumbShow: false,
        optionShow: false,
      },
      title: {
        text:
          t(translations.highcharts.burntFeesAnalysis.burntRateInDaoVoting) +
          t(translations.highcharts.burntFeesAnalysis.learnMore),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'category',
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },
      rangeSelector: {
        enabled: false,
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis['baseFeeBurntRate'],
          )}</span>`,
          color: '#7cb5ec',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis['storageBurntRate'],
          )}</span>`,
          color: '#434348',
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
