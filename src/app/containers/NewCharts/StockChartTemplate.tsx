import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';
import { reqChartData } from 'utils/httpRequest';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
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

export function StockChartTemplate({
  title,
  subtitle,
  options,
  request,
}: Props) {
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
        alignTicks: false,
        height: 600,
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
        line: {
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
        },
      },
      tooltip: {
        split: false,
      },
      yAxis: {
        opposite: false,
      },
      series: [
        {
          dataGrouping: {
            units: [
              [
                'week', // unit name
                [1], // allowed multiples
              ],
              ['month', [1, 2, 3, 4, 6]],
            ],
          },
          data: request.formatter(data),
        },
      ],
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
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
    },
    options,
  );

  return (
    <div>
      <PageHeader subtitle={subtitle}>{title}</PageHeader>
      <Card
        style={{
          padding: '1.2857rem',
        }}
      >
        <HighchartsReact
          constructorType={'stockChart'}
          highcharts={Highcharts}
          options={opts}
          ref={chart}
        />
      </Card>
    </div>
  );
}
