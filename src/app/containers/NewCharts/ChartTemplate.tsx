import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsExporting from 'highcharts/modules/exporting';
// import HighchartsExportData from 'highcharts/modules/export-data';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highcharts);
  // HighchartsExportData(Highcharts);
}

// @ts-ignore
window.dayjs = dayjs;

export function ChartTemplate({ title, subtitle, options }) {
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
        <HighchartsReact highcharts={Highcharts} options={opts} />
      </Card>
    </div>
  );
}
