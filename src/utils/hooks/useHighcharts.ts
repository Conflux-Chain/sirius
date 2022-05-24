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
  },
};

export const useHighcharts = (chart?) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.includes('zh') ? 'zh' : 'en';

  useEffect(() => {
    Highstock.setOptions({
      lang: localeData[lang],
    });

    Highcharts.setOptions({
      lang: localeData[lang],
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
