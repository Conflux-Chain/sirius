import React, { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import { reqChartDataOfMining } from 'utils/httpRequest';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

// @ts-ignore
window.dayjs = dayjs;

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

    fn().catch(e => {
      console.log('BlockTime request error: ', e);
    });
  }, []);

  const options = useMemo(
    () => ({
      chart: {
        zoomType: 'x',
      },
      title: {
        text: 'ConfluxScan Average Block Time Chart',
      },
      subtitle: {
        text:
          'Source: ConfluxScan.io<br/>Click and drag in the plot area to zoom in',
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
        // min: 0,
        title: {
          text: 'Block Time in Secs',
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
          name:
            '[ <span style="color:rgb(124, 181, 236);">Block Time (Secs)</span> ]',
        },
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
            ],
          },
        },
      },
    }),
    [data],
  );

  console.log(
    data.list?.map(s => [
      // @ts-ignore
      dayjs(s.statTime).valueOf(),
      // @ts-ignore
      Number(s.blockTime),
    ]),
  );

  return (
    <div>
      <PageHeader subtitle="The ConfluxScan Average Block Time Chart shows the historical average time taken in seconds for a block to be included in the ConfluxScan blockchain.">
        {t(translations.charts.subtitle2)}
      </PageHeader>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
