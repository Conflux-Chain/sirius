import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import {
  StockChartTemplate,
  ChildProps,
} from 'app/components/Charts/StockChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import { Wrapper } from './Wrapper';

export function DailyAPY({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'daily-apy',
    title: t(translations.highcharts.pos.apy.title),
    subtitle: t(translations.highcharts.pos.apy.subtitle),
    request: {
      url: OPEN_API_URLS.PoSDailyAPY,
      formatter: data => {
        return [
          data?.list?.map((d, i) => {
            return [dayjs.utc(d.day).valueOf(), Number(d.v)];
          }),
        ];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.apy.title),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.apy.yAxisTitle),
        },
      },
      tooltip: {
        valueDecimals: 2,
        valueSuffix: '%',
      },
      series: [
        {
          type: 'area',
          name: `<span>${t(translations.highcharts.pos.apy.seriesName)}</span>`,
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
