import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from 'sirius-next/packages/common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from 'sirius-next/packages/common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import BigNumber from 'bignumber.js';

export function TotalSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.supply,
      formatter: data => {
        let result: any = [];

        if (data) {
          result = [
            {
              name: t(translations.highcharts.pow.totalSupply.fourYearUnlock),
              y: parseInt(new SDK.Drip(data?.fourYearUnlockBalance).toCFX()),
            },
            {
              name: t(translations.highcharts.pow.totalSupply.zeroAddress),
              y: parseInt(new SDK.Drip(data?.nullAddressBalance).toCFX()),
            },
            {
              name: t(
                translations.highcharts.pow.totalSupply.circulatingSupply,
              ),
              y: parseInt(
                new SDK.Drip(
                  new BigNumber(data?.totalCirculating)
                    .minus(data?.nullAddressBalance)
                    .toNumber(),
                ).toCFX(),
              ),
            },
          ];

          if (new BigNumber(data?.twoYearUnlockBalance).gt(0)) {
            result.push({
              name: t(translations.highcharts.pow.totalSupply.twoYearUnlock),
              y: parseInt(new SDK.Drip(data?.twoYearUnlockBalance).toCFX()),
            });
          }
        }

        return result;
      },
    },
    options: {
      chart: {
        type: 'pie',
      },
      header: {
        optionShow: false,
        title: {
          text: t(translations.highcharts.pow.totalSupply.title),
        },
        subtitle: {
          text: t(translations.highcharts.pow.totalSupply.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pow.breadcrumb.charts),
            path: '/pow-charts',
          },
          {
            name: t(translations.highcharts.pow.breadcrumb['supply']),
            path: '/pow-charts/supply',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pow.totalSupply.title),
      },
      tooltip: {
        pointFormat: `Amount: <b>{point.y}</b><br>Percentage: <b>{point.percentage:.2f}%</b>`,
        valueSuffix: ' CFX',
      },
      series: [
        {
          type: 'pie',
        },
      ],
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
