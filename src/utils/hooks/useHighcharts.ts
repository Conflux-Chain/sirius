import { useEffect } from 'react';
import Highstock from 'highcharts/highstock';
import Highcharts from 'highcharts';
import { useTranslation } from 'react-i18next';
import HighchartsExporting from 'highcharts/modules/exporting';

if (typeof Highcharts === 'object') {
  HighchartsExporting(Highstock);
  HighchartsExporting(Highcharts);
}

const localeData = {
  en: {
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    loading: 'Loading...',
    rangeSelectorZoom: 'Zoom',
    viewFullscreen: 'View in full screen',
    exitFullscreen: 'Exit from full screen',
    printChart: 'Print chart',
    exportButtonTitle: 'Export',
    downloadPNG: 'Download imagem PNG',
    downloadJPEG: 'Download imagem JPEG',
    downloadPDF: 'Download documento PDF',
    downloadSVG: 'Download imagem SVG',
    downloadCSV: 'Download imagem CSV',
    downloadXLS: 'Download imagem XLS',
  },
  zh: {
    shortMonths: [
      '1月',
      '2月',
      '3月',
      '4月',
      '5月',
      '6月',
      '7月',
      '8月',
      '9月',
      '10月',
      '11月',
      '12月',
    ],
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    loading: '加载中...',
    rangeSelectorZoom: '缩放',
    viewFullscreen: '全屏展示',
    exitFullscreen: '退出全屏',
    printChart: '打印图表',
    exportButtonTitle: '导出',
    downloadPNG: '下载 PNG',
    downloadJPEG: '下载 JPEG',
    downloadPDF: '下载 PDF',
    downloadSVG: '下载 SVG',
    downloadCSV: '下载 CSV',
    downloadXLS: '下载 XLS',
  },
};

const tooltipData = {
  en: {
    xDateFormat: '%a %e, %b %Y (UTC)',
  },
  zh: {
    xDateFormat: '%a, %b %e, %Y (UTC)',
  },
};

const xAxisData = {
  en: {
    labels: { format: `{value:%e '%b}` },
  },
  zh: {
    labels: { format: `{value:%b '%e}` },
  },
};

export const xAxisCustomLabelYear = {
  labels: {
    formatter: data => {
      const date = new Date(data.value);
      if (date.getMonth() === 0) {
        return Highcharts.dateFormat('%Y', data.value);
      } else {
        return Highcharts.dateFormat("%e '%b", data.value);
      }
    },
  },
};
export const xAxisCustomLabelHour = {
  labels: {
    formatter: data => {
      const date = new Date(data.value);
      const intervalType = data.chart.options.intervalType.value;
      if (intervalType === 'min' || intervalType === 'hour') {
        if (date.getUTCHours() === 0 && date.getUTCMinutes() === 0) {
          return Highcharts.dateFormat("%e '%b", data.value);
        } else {
          return Highcharts.dateFormat('%H:%M', data.value);
        }
      } else {
        return Highcharts.dateFormat("%e '%b", data.value);
      }
    },
  },
};

export const tooltipCustomLabel = {
  split: false,
  useHTML: true,
  formatter: data => {
    const chart = data.chart;
    const point = chart.hoverPoint;
    const series = point.series;
    const intervalType = chart.options.intervalType.value;

    const timeRules =
      intervalType === 'min' || intervalType === 'hour'
        ? '%H:%M, %a %d, %b %Y (UTC)'
        : '%a %e, %b %Y (UTC)';
    const header = Highcharts.dateFormat(timeRules, point.x);
    let pointFormat = `<table>
    <tr>
      <th colspan="2" style="font-weight: normal;">${header}</th>
    </tr>
    <tr style="border-bottom: 1px solid #ccc;">
      <th style="padding-bottom: 5px;"></th>
    </tr>
    <tr><td style="padding-top: 5px;"></td></tr>
    <tr>
      <td style="color: ${series.color}; padding-right: 10px;">[ ${series.name} ]</td>
      <td style="text-align: right"><b>${point.y}</b></td>  
    </tr>
    </table>
   `;
    return pointFormat;
  },

  shape: 'square',
  shared: true,
};

export const useHighcharts = (chart?) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';

  useEffect(() => {
    Highstock.setOptions({
      lang: localeData[lang],
      tooltip: tooltipData[lang],
      xAxis: xAxisData[lang],
    });

    Highcharts.setOptions({
      lang: localeData[lang],
      tooltip: tooltipData[lang],
      xAxis: xAxisData[lang],
    });

    const c = chart.current?.chart;
    if (c) {
      c.options.lang = {
        ...chart.current.chart.options.lang,
        ...localeData[lang],
      };
    }
  }, [lang, chart]);

  return { lang };
};
