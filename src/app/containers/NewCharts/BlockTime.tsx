import React, { useEffect, useState } from 'react';
import { reqChartDataOfMining } from 'utils/httpRequest';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate } from './ChartTemplate';

export function BlockTime() {
  const { t } = useTranslation();
  const [data, setData] = useState({
    list: [],
  });

  useEffect(() => {
    async function fn() {
      const data = await reqChartDataOfMining({
        query: { limit: 60, intervalType: 'day', sort: 'ASC' },
      });

      setData(data);
    }

    fn();
  }, []);

  return (
    <ChartTemplate
      title={t(translations.highcharts.averageBlockTime.title)}
      subtitle={t(translations.highcharts.averageBlockTime.subtitle)}
      options={{
        chart: {
          zoomType: 'x',
        },
        title: {
          text: t(translations.highcharts.averageBlockTime.title),
        },
        subtitle: {
          text: t(translations.highcharts.subtitle),
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>',
          valueDecimals: 2,
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: t(translations.highcharts.averageBlockTime.yAxisTitle),
          },
        },
        series: [
          {
            type: 'column',
            data: data.list?.map(s => [
              // @ts-ignore
              dayjs(s.statTime).valueOf(),
              // @ts-ignore
              Number(s.blockTime),
            ]),
            name: `[ <span style="color:rgb(124, 181, 236);">${t(
              translations.highcharts.averageBlockTime.seriesName,
            )}</span> ]`,
          },
        ],
        // exporting: {
        //   csv: {
        //     columnHeaderFormatter: (item, key, keyLength) => {
        //       if (key === 'y') {
        //         return 'Value';
        //       } else {
        //         return 'Date(UTC)';
        //       }
        //     },
        //   },
        // },
      }}
    ></ChartTemplate>
  );
}
