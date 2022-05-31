import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ChartTemplate, ChildProps } from 'app/components/Charts/ChartTemplate';
import { OPEN_API_URLS } from 'utils/constants';
import SDK from 'js-conflux-sdk';
import { Wrapper } from './Wrapper';

export function TotalSupply({ preview = false }: ChildProps) {
  const { t } = useTranslation();

  const props = {
    name: 'supply',
    preview,
    title: t(translations.highcharts.pos.totalSupply.title),
    subtitle: t(translations.highcharts.pos.totalSupply.subtitle),
    request: {
      url: OPEN_API_URLS.supply,
      formatter: data => {
        if (data) {
          return [
            {
              name: t(translations.highcharts.pos.totalSupply.fourYearUnlock),
              y: parseInt(new SDK.Drip(data?.fourYearUnlockBalance).toCFX()),
            },
            {
              name: t(translations.highcharts.pos.totalSupply.twoYearUnlock),
              y: parseInt(new SDK.Drip(data?.twoYearUnlockBalance).toCFX()),
            },
            {
              sliced: true,
              selected: true,
              name: t(
                translations.highcharts.pos.totalSupply.circulatingUnlock,
              ),
              y: parseInt(new SDK.Drip(data?.totalCirculating).toCFX()),
            },
          ];
        }
        return [];
      },
    },
    options: {
      title: {
        text: t(translations.highcharts.pos.totalSupply.title),
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
