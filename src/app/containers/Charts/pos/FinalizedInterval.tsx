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

export function FinalizedInterval({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    preview: preview,
    name: 'finalized-interval',
    title: t(translations.highcharts.pos.finalizedInterval.title),
    subtitle: t(translations.highcharts.pos.finalizedInterval.subtitle),
    request: {
      url: OPEN_API_URLS.PoSFinalizedInterval,
      formatter: data => {
        const data1: any = [];
        const data2: any = [];

        data?.list?.map((d, i) => {
          const t = dayjs.utc(d.day).valueOf();
          data1.push([t, Number(d.finalize_second_gap)]);
          data2.push([t, Number(d.finalize_epoch_gap)]);
        });

        return [data1, data2];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      title: {
        text: t(translations.highcharts.pos.finalizedInterval.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: t(translations.highcharts.pos.finalizedInterval.yAxisTitle),
        },
      },
      series: [
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.finalizedInterval.seriesName,
          )}</span>`,
          tooltip: {
            valueSuffix: 's',
          },
        },
        {
          type: 'line',
          name: `<span>${t(
            translations.highcharts.pos.finalizedInterval.seriesName2,
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
