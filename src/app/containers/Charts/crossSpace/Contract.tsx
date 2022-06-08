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
import { CROSS_SPACE_ADDRESS } from 'utils/constants';

export function Contract({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'contract',
    title: t(translations.highcharts.crossSpace.contract.title),
    subtitle: t(translations.highcharts.crossSpace.contract.subtitle),
    request: {
      url: OPEN_API_URLS.contract,
      query: {
        address: CROSS_SPACE_ADDRESS,
        limit: 10000,
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.statTime).valueOf();
          data1.push([t, Number(d.tx)]);
          data2.push([t, Number(d.cfxTransfer)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
        type: 'line',
      },
      title: {
        text: t(translations.highcharts.crossSpace.contract.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.crossSpace.contract.yAxisTitle),
        },
      },
      series: [
        {
          name: `<span>${t(
            translations.highcharts.crossSpace.contract.seriesName,
          )}</span>`,
        },
        {
          name: `<span>${t(
            translations.highcharts.crossSpace.contract.seriesName2,
          )}</span>`,
        },
      ],
    },
  };

  return (
    <Wrapper {...props}>
      <StockChartTemplate {...props}></StockChartTemplate>
    </Wrapper>
  );
}
