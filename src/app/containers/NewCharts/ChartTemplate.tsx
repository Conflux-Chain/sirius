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
