import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { ChartTemplate, ChildProps } from 'app/components/Charts/ChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import { Wrapper } from './Wrapper';
import BigNumber from 'bignumber.js';

export function TotalSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'supply',
    preview,
    title: t(translations.highcharts.pow.totalSupply.title),
    subtitle: t(translations.highcharts.pow.totalSupply.subtitle),
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

  return (
    <Wrapper {...props}>
      <ChartTemplate {...props}></ChartTemplate>
    </Wrapper>
  );
}
