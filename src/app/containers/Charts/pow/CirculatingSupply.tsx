import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StockChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/StockChartTemplate';
import { PreviewChartTemplate } from '@cfxjs/sirius-next-common/dist/components/Charts/PreviewChartTemplate';
import { ChildProps } from '@cfxjs/sirius-next-common/dist/components/Charts/config';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import BigNumber from 'bignumber.js';

export function CirculatingSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    request: {
      url: OPEN_API_URLS.supply,
      formatter: data => {
        if (data) {
          return [
            {
              name: t(translations.highcharts.pow.circulatingSupply.others),
              y: parseInt(
                new SDK.Drip(
                  new BigNumber(data?.totalCirculating)
                    .minus(data?.nullAddressBalance)
                    .minus(data?.totalStaking)
                    .minus(data?.totalCollateral)
                    .toNumber(),
                ).toCFX(),
              ),
            },
            {
              name: t(
                translations.highcharts.pow.circulatingSupply.totalCollateral,
              ),
              y: parseInt(new SDK.Drip(data?.totalCollateral).toCFX()),
            },
            {
              name: t(
                translations.highcharts.pow.circulatingSupply.totalStaking,
              ),
              y: parseInt(new SDK.Drip(data?.totalStaking).toCFX()),
            },
          ];
        }
        return [];
      },
    },
    options: {
      chart: {
        type: 'pie',
      },
      header: {
        optionShow: false,
        title: {
          text: t(translations.highcharts.pow.circulatingSupply.title),
        },
        subtitle: {
          text: t(translations.highcharts.pow.circulatingSupply.subtitle),
        },
        breadcrumb: [
          {
            name: t(translations.highcharts.pow.breadcrumb.charts),
            path: '/pow-charts',
          },
          {
            name: t(translations.highcharts.pow.breadcrumb['circulating']),
            path: '/pow-charts/circulating',
          },
        ],
      },
      title: {
        text: t(translations.highcharts.pow.circulatingSupply.title),
      },
      subtitle: {
        text: t(translations.highcharts.subtitle),
      },
      tooltip: {
        pointFormat: `Amount: <b>{point.y}</b><br>Percentage: <b>{point.percentage:.2f}%</b>`,
        valueSuffix: ' CFX',
      },
    },
  };

  return preview ? (
    <PreviewChartTemplate {...props}></PreviewChartTemplate>
  ) : (
    <StockChartTemplate {...props}></StockChartTemplate>
  );
}
