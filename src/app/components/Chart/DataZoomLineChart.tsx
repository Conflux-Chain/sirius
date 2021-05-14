import React from 'react';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { formatNumber } from '../../../utils';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  dateKey?: string;
  valueKey?: string | string[];
  indicator?: string;
  width?: number | string;
  minHeight?: number;
  data?: any[];
}
export const DataZoomLineChart = ({
  indicator = '',
  dateKey = 'day',
  valueKey = 'value',
  width = document.body.clientWidth,
  minHeight = 500,
  data = [],
}: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';
  const dateFormatter = function (value, simple = false) {
    return dayjs(value).format(
      lang === 'zh'
        ? simple
          ? 'MM月DD日'
          : 'YYYY-MM-DD'
        : simple
        ? 'MMM DD'
        : 'MMM DD, YYYY',
    );
  };

  if (!Array.isArray(valueKey)) {
    valueKey = [valueKey as string];
  }

  const chartData = data
    // sort for data zoom thumbnail
    .sort((a, b) => a[dateKey].localeCompare(b[dateKey]))
    .map(d => [d[dateKey], ...(valueKey as string[]).map(v => +d[v])]);

  return (
    <ReactECharts
      style={{ minHeight }}
      notMerge={true}
      option={{
        tooltip: {
          trigger: 'axis',
          confine: true,
          position: function (pt) {
            return [pt[0], '10%'];
          },
          formatter: function (params) {
            const data = params
              .map(
                p =>
                  `<div>
<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${
                    p.color
                  };"></span>
<span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${
                    p.seriesName
                  }</span>
<span style="${
                    p.seriesName ? 'float:right;margin-left:20px;' : ''
                  }font-size:14px;color:#666;font-weight:700">${formatNumber(
                    p.data[1],
                  )}</span>
<div style="clear:both"></div>
</div>`,
              )
              .join('');
            return `<div style="font-weight: 700;margin-bottom: 10px;">${dateFormatter(
              params[0].data[0],
            )}</div>${data}`;
          },
        },
        grid: {
          top: minHeight < 400 ? 20 : 40,
          left: '80',
          right: '10',
          bottom: typeof width === 'number' && width < 800 ? '100' : '70',
        },
        legend: {
          show: valueKey.length > 1,
          itemGap: 10,
          right: 10,
        },
        xAxis: {
          type: 'time',
          boundaryGap: false,
          axisLabel: {
            rotate: typeof width === 'number' && width < 800 ? -30 : 0,
            formatter: v => dateFormatter(v, minHeight < 400),
          },
        },
        yAxis: {
          type: 'value',
          // boundaryGap: [0, '10%'],
          // axisLabel: {
          //   formatter: function (value) {
          //     return formatNumber(value);
          //   },
          // },
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter',
            rangeMode: ['percent', 'percent'],
            start: 100,
            end: 30,
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
        series: valueKey.map((v, i) => ({
          name: t(translations.charts[indicator][v]) || '',
          type: 'line',
          symbol: 'none',
          data: chartData.map(d => [d[0], d[i + 1]]),
        })),
      }}
    />
  );
};
