import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
function generateRandomNumbers() {
  // 生成两个介于 0 和 100 之间的随机数
  const num1 = Math.random() * 100;
  const num2 = Math.random() * (100 - num1);

  // 第三个数是 100 减去前两个数的和
  const num3 = 100 - num1 - num2;

  // 四舍五入到整数
  const roundedNum1 = Math.round(num1);
  const roundedNum2 = Math.round(num2);
  const roundedNum3 = Math.round(num3);

  // 调整总和为 100，因为四舍五入可能会导致总和不为 100
  const total = roundedNum1 + roundedNum2 + roundedNum3;

  if (total !== 100) {
    const diff = 100 - total;
    // 将差值加到最大的那个数上，以确保和为 100
    if (Math.abs(diff) > 0) {
      if (roundedNum1 >= roundedNum2 && roundedNum1 >= roundedNum3) {
        return [roundedNum1 + diff, roundedNum2, roundedNum3];
      } else if (roundedNum2 >= roundedNum1 && roundedNum2 >= roundedNum3) {
        return [roundedNum1, roundedNum2 + diff, roundedNum3];
      } else {
        return [roundedNum1, roundedNum2, roundedNum3 + diff];
      }
    }
  }

  return [roundedNum1, roundedNum2, roundedNum3];
}
export function PercentageOfTxTypeInBlock({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.percentageOfTxTypeInBlock,
      query: {
        intervalType: 'day',
        limit: '2000',
      },
      formatter: data => {
        const data1: any = [];
        const data2: any = [];
        const data3: any = [];
        const timestamps = new Set();

        data?.list?.forEach(d => {
          let t = dayjs.utc(d.timestamp * 1000).valueOf();
          while (timestamps.has(t)) {
            t += 1;
          }
          timestamps.add(t);
          // const [cip1559, cip2930, legacy] = generateRandomNumbers();
          // data1.push([t, Number(cip1559)]);
          // data2.push([t, Number(cip2930)]);
          // data3.push([t, Number(legacy)]);
          data1.push([t, Number(d.txsInType.cip1559)]);
          data2.push([t, Number(d.txsInType.cip2930)]);
          data3.push([t, Number(d.txsInType.legacy)]);
        });

        return [data1, data2, data3];
      },
    },
    options: {
      chart: {
        zoomType: 'x',
      },
      header: {
        titleShow: false,
        breadcrumbShow: false,
        optionShow: false,
      },
      title: {
        text: t(
          translations.highcharts.burntFeesAnalysis.PercentageOfTxTypeInBlock,
        ),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        min: 0,
        max: 100,
        labels: {
          format: '{value}%',
        },
      },
      plotOptions: {
        column: {
          stacking: 'normal',
        },
      },
      tooltip: {
        shared: true,
        xDateFormat: '%Y-%m-%d %H:%M:%S',
      },
      series: [
        {
          type: 'column',
          name: `<span>CIP-1559</span>`,
          color: '#7cb5ec',
        },
        {
          type: 'column',
          name: `<span>CIP-2930</span>`,
          color: '#434348',
        },
        {
          type: 'column',
          name: `<span>${t(
            translations.highcharts.burntFeesAnalysis.Legacy,
          )}</span>`,
          color: '#90ed7d',
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
