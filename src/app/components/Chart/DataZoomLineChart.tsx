import React from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { formatNumber } from '../../../utils';
import { useTranslation } from 'react-i18next';

interface Props {
  dateKey?: string;
  valueKey?: string;
  indicator?: string;
  width?: number;
  data?: any[];
}
export const DataZoomLineChart = ({
  indicator,
  dateKey = 'day',
  valueKey = 'value',
  width = document.body.clientWidth,
  data = [],
}: Props) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const dateFormatter = function (value) {
    return dayjs(value).format(lang === 'zh' ? 'YYYY-MM-DD' : 'MMM DD, YYYY');
  };

  const chartData = data
    // sort for data zoom thumbnail
    .sort((a, b) => a[dateKey].localeCompare(b[dateKey]))
    .map(d => [d[dateKey], d[valueKey]]);

  return (
    <ReactECharts
      style={{ minHeight: 500 }}
      notMerge={true}
      option={{
        tooltip: {
          trigger: 'axis',
          confine: true,
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter: function (params) {
            return `${dateFormatter(
              params[0].data[0],
            )}<br/><strong>${formatNumber(params[0].data[1])}</strong>`;
          },
        },
        grid: {
          left: '80',
          right: '10',
          bottom: width < 800 ? '100' : '70',
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            rotate: width < 800 ? -30 : 0,
            formatter: dateFormatter,
          },
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '10%'],
          axisLabel: {
            formatter: function (value) {
              return formatNumber(value);
            },
          },
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter',
            rangeMode: ['percent', 'percent'],
            start: 100,
            end: 0,
          },
          {
            id: 'dataZoomY',
            type: 'slider',
            filterMode: 'empty',
            labelFormatter: function (value) {
              return dateFormatter(value);
            },
          },
        ],
        series: [
          {
            type: 'line',
            symbol: 'none',
            areaStyle: {},
            data: chartData,
          },
        ],
      }}
    />
  );
};
