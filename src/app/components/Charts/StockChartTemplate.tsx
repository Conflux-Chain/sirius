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
  plain?: boolean;
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
  plain,
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

      const limit = preview ? 30 : 10000;
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
      colors: [
        '#7cb5ec',
        '#434348',
        '#f7a35c',
        '#2b908f',
        '#91e8e1',
        '#90ed7d',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#f45b5b',
      ],
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
      legend: {
        enabled: options.series.length > 1,
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
            <td style="color: {series.color}; padding-right: 10px;">[ {series.name} ]</td>
            <td style="text-align: right"><b>{point.y}</b></td>  
          </tr>`,
        footerFormat: '</table>',
        shape: 'square',
        shared: true,
      },
      yAxis: {
        opposite: false,
      },
      series: options.series.map((s, i) => ({
        data: request.formatter(data)[i],
      })),
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
      {preview || plain ? null : (
        <PageHeader subtitle={subtitle}>{title}</PageHeader>
      )}
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
