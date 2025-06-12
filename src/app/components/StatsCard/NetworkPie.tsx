import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fromDripToCfx } from '@cfxjs/sirius-next-common/dist/utils';

export function NetworkPie({ data }) {
  const { t } = useTranslation();
  const chart = useRef(null);

  const options = {
    title: {
      text: '',
    },
    credits: {
      enabled: false,
    },
    height: 9 / 21 / 100 + '%',
    tooltip: {
      outside: true,
      formatter: function () {
        // @ts-ignore
        const data = this.point;
        if (data) {
          return `${t(translations.statistics.column.rank)}: <b>${
            data.name
          }</b><br>${t(translations.statistics.column.address)}: <b>${
            data.address
          }</b><br>${t(
            translations.statistics.column.fees,
          )}: <b>${fromDripToCfx(data.value, true)} CFX</b>`;
        }
        return '';
      },
    },
    series: [
      {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
        },
        data: data.map((d, i) => {
          d.y = d.value;

          if (!i) {
            d.sliced = true;
            d.selected = true;
          }

          return d;
        }),
      },
    ],
    exporting: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact highcharts={Highcharts} options={options} ref={chart} />
  );
}
