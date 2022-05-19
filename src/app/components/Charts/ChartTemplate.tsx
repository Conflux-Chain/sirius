import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';
import { reqChartData } from 'utils/httpRequest';
import { useBreakpoint } from 'styles/media';
import { useHighcharts } from 'utils/hooks/useHighcharts';

// @ts-ignore
window.dayjs = dayjs;

interface Props {
  preview?: boolean;
  title: string;
  subtitle: string;
  options: any;
  request: {
    url: string;
    query?: any;
    formatter: (data) => {};
  };
}

export interface ChildProps {
  preview?: boolean;
}

export function ChartTemplate({
  preview,
  title,
  subtitle,
  options,
  request,
}: Props) {
  const bp = useBreakpoint();
  const chart = useRef(null);
  const [data, setData] = useState(null);

  useHighcharts();

  useEffect(() => {
    async function fn() {
      // @ts-ignore
      chart.current?.chart.showLoading();

      const limit = preview ? 30 : 100;

      const data = await reqChartData({
        url: request.url,
        query: request.query || {
          limit: limit,
          intervalType: 'day',
        },
      });

      setData(data);

      // @ts-ignore
      chart.current?.chart.hideLoading();
    }

    fn();
  }, [preview, request.query, request.url]);

  const opts = lodash.merge(
    {
      chart: {
        animation: false,
        height: 600,
      },
      credits: {
        enabled: false,
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
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
          colorByPoint: true,
        },
      },
      tooltip: {
        shape: 'square',
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

  if (preview) {
    opts.chart.height = 240;
    opts.chart.zoomType = undefined;
    opts.title = '';
    opts.subtitle = '';
    opts.exporting.enabled = false;
  }

  if (bp === 's') {
    opts.chart.height = 360;
  }

  // TODO, add export CSV

  return (
    <div>
      {preview ? null : <PageHeader subtitle={subtitle}>{title}</PageHeader>}
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
