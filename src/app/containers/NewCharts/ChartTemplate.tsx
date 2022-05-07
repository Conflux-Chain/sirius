import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsExportData from 'highcharts/modules/export-data';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';
import { reqChartData } from 'utils/httpRequest';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  // HighchartsExportData(Highcharts);
}

// @ts-ignore
window.dayjs = dayjs;

interface Props {
  title: string;
  subtitle: string;
  options: any;
  request: {
    url: string;
    query: any;
    formatter: (data) => {};
  };
}

export function ChartTemplate({ title, subtitle, options, request }: Props) {
  const chart = useRef(null);
  const [data, setData] = useState({
    list: [],
  });

  useEffect(() => {
    async function fn() {
      // @ts-ignore
      chart.current?.chart.showLoading();

      const data = await reqChartData({
        url: request.url,
        query: request.query || { limit: 60, intervalType: 'day', sort: 'ASC' },
      });

      setData(data);

      // @ts-ignore
      chart.current?.chart.hideLoading();
    }

    fn();
  }, [request.query, request.url]);

  const opts = lodash.merge(
    {
      chart: {
        animation: false,
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              // @ts-ignore
              [0, Highcharts.getOptions().colors[0]],
              [
                1,
                // @ts-ignore
                Highcharts.color(Highcharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get('rgba'),
              ],
            ],
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          data: request.formatter(data),
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
              // 'separator',
              // 'downloadCSV',
            ],
          },
        },
        //   csv: {
        //     columnHeaderFormatter: (item, key, keyLength) => {
        //       if (key === 'y') {
        //         return 'Value';
        //       } else {
        //         return 'Date(UTC)';
        //       }
        //     },
        //   },
      },
    },
    options,
  );

  // TODO, add export CSV

  return (
    <div>
      <PageHeader subtitle={subtitle}>{title}</PageHeader>
      <Card
        style={{
          padding: '1.2857rem',
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={opts} ref={chart} />
      </Card>
    </div>
  );
}
