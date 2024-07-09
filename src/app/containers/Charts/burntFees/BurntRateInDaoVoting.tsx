import React from 'react';
import dayjs from 'dayjs';
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

        data?.list.map(d => {
          let t = dayjs.utc(d.timestamp * 1000).valueOf();

          data1.push([t, Number(d.baseFeeShareRate)]);
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
        text: `${t(
          translations.highcharts.burntFeesAnalysis.burntRateInDaoVoting,
        )} <a href="https://confluxhub.io/governance/vote/onchain-dao-voting" target="blank">${t(
          translations.highcharts.burntFeesAnalysis.learnMore,
        )}</a>`,
        useHTML: true,
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
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
            translations.highcharts.burntFeesAnalysis.baseFeeBurntRate,
          )}</span>`,
          color: '#7cb5ec',
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis.storageBurntRate,
          )}</span>`,
          color: '#434348',
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
