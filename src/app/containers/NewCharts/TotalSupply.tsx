import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate, ChildProps } from './ChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import { Wrapper } from './Wrapper';

export function TotalSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'supply',
    preview,
    title: t(translations.highcharts.totalSupply.title),
    subtitle: t(translations.highcharts.totalSupply.subtitle),
    request: {
      url: OPEN_API_URLS.supply,
      formatter: data => {
        if (data) {
          return [
            {
              name: t(translations.highcharts.totalSupply.fourYearUnlock),
              y: parseInt(new SDK.Drip(data?.fourYearUnlockBalance).toCFX()),
            },
            {
              name: t(translations.highcharts.totalSupply.twoYearUnlock),
              y: parseInt(new SDK.Drip(data?.twoYearUnlockBalance).toCFX()),
            },
            {
              sliced: true,
              selected: true,
              name: t(translations.highcharts.totalSupply.circulatingUnlock),
              y: parseInt(new SDK.Drip(data?.totalCirculating).toCFX()),
            },
          ];
        }
        return [];
      },
    },
    options: {
      title: {
        text: t(translations.highcharts.totalSupply.title),
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>',
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
