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
import BigNumber from 'bignumber.js';

export function Token({
  preview = false,
  address,
  type,
}: ChildProps & { address: string; type: string }) {
  const { t } = useTranslation();

  const props = {
    plain: true,
    preview: preview,
    name: '',
    title: t(translations.highcharts.pow.token.title),
    subtitle: t(translations.highcharts.pow.token.subtitle),
    request: {
      url: OPEN_API_URLS.token,
      query: {
        base32: address,
        limit: 2000,
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];
        const data4: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, new BigNumber(d.transferAmount).div(1e18).toNumber()]);
          data2.push([t, Number(d.transferCount)]);
          data3.push([t, Number(d.uniqueReceiver)]);
          data4.push([t, Number(d.uniqueSender)]);
        });

        if (type.indexOf('20') > -1) {
          return [data1, data2, data3, data4];
        } else {
          return [data2, data3, data4];
        }
      },
    },
    options: {
      chart: {
        zoomType: 'x',
        type: 'line',
      },
      title: {
        text: t(translations.highcharts.pow.token.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pow.token.yAxisTitle),
        },
      },
      series: [
        {
          name: `<span>${t(
            translations.highcharts.pow.token.seriesName2,
          )}</span>`,
        },
        {
          name: `<span>${t(
            translations.highcharts.pow.token.seriesName3,
          )}</span>`,
        },
        {
          name: `<span>${t(
            translations.highcharts.pow.token.seriesName4,
          )}</span>`,
        },
      ],
    },
  };

  if (type.indexOf('20') > -1) {
    props.options.series.unshift({
      name: `<span>${t(translations.highcharts.pow.token.seriesName)}</span>`,
      // @ts-ignore
      tooltip: {
        valueDecimals: 2,
      },
    });
  }

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
