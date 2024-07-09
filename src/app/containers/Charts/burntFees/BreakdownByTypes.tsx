import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';

export function BreakdownByTypes({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.breakdownByBurntType,
      formatter: data => {
        let result: any = [];
        if (data) {
          result = [
            {
              name: t(
                translations.highcharts.burntFeesAnalysis['1559MetricsBurn'],
              ),
              y: parseInt(new SDK.Drip(data?.list[0].burntGasFeeTotal).toCFX()),
            },
            {
              name: t(translations.highcharts.burntFeesAnalysis.storageBurn),
              y: parseInt(
                new SDK.Drip(data?.list[0].burntStorageFeeTotal).toCFX(),
              ),
            },
          ];
        }

        return result;
      },
    },
    options: {
      chart: {
        type: 'pie',
      },
      header: {
        titleShow: false,
        breadcrumbShow: false,
        optionShow: false,
      },
      title: {
        text: t(translations.highcharts.burntFeesAnalysis.breakdownByTypes),
      },
      tooltip: {
        pointFormat: `Amount: <b>{point.y}</b><br>Percentage: <b>{point.percentage:.2f}%</b>`,
        valueSuffix: ' CFX',
      },
      series: [
        {
          type: 'pie',
          colors: ['#90ed7d', '#7cb5ec'],
        },
      ],
    },
  };

  return <StockChartTemplate {...props}></StockChartTemplate>;
}
