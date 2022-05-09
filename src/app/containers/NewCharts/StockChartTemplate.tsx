import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';
import { reqChartData } from 'utils/httpRequest';
import { useBreakpoint } from 'styles/media';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
}

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

export function StockChartTemplate({
  preview,
  title,
  subtitle,
  options,
  request,
}: Props) {
  const bp = useBreakpoint();
  const chart = useRef(null);
  const [data, setData] = useState({
    list: [],
  });

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
      data.list = data.list.reverse(); // use latest data sort by asc

      setData(data);

      // @ts-ignore
      chart.current?.chart.hideLoading();
    }

    fn();
  }, [preview, request.query, request.url]);

  const opts = lodash.merge(
    {
      chart: {
        alignTicks: false,
        height: 600,
      },
      navigator: {
        enabled: true,
      },
      rangeSelector: {
        enabled: true,
      },
      scrollbar: {
        enabled: true,
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
        useHTML: true,
        xDateFormat: '%a %e, %b %Y (UTC)',
        headerFormat: `<table>
            <tr>
              <th colspan="2" style="font-weight: normal;">{point.key}</th>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="padding-bottom: 5px;"></th>
            </tr>
            `,
        pointFormat: `
          <tr><td style="padding-top: 5px;"></td></tr>
          <tr>
            <td style="color: {series.color}; padding-right: 10px;">{series.name}</td>
            <td style="text-align: right"><b>{point.y}</b></td>  
          </tr>`,
        footerFormat: '</table>',
        valueDecimals: 2,
        shape: 'square',
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

  if (preview) {
    opts.chart.height = 240;
    opts.chart.zoomType = undefined;
    opts.title = '';
    opts.subtitle = '';
    opts.exporting.enabled = false;
    opts.navigator.enabled = false;
    opts.rangeSelector.enabled = false;
    opts.scrollbar.enabled = false;
  }

  if (bp === 's') {
    opts.chart.height = 360;
  }

  return (
    <>
      {preview ? null : <PageHeader subtitle={subtitle}>{title}</PageHeader>}
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
    </>
  );
}
