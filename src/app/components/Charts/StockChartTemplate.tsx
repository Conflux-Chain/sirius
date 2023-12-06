import React, { useState, useEffect, useRef, useCallback } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import dayjs from 'dayjs';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Card } from 'app/components/Card/Loadable';
import lodash from 'lodash';
import { reqChartData } from 'utils/httpRequest';
import { useBreakpoint } from 'styles/media';
import { useHighcharts } from 'utils/hooks/useHighcharts';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { getChartsSubTitle } from 'utils';
import styled from 'styled-components/macro';

// @ts-ignore
window.dayjs = dayjs;

interface Props {
  plain?: boolean;
  preview?: boolean;
  title: string;
  subtitle: string;
  options: any;
  request: {
    url: string;
    query?: any;
    formatter: (data) => {};
  };
}

interface ScopeItem {
  label: string;
  limit: number;
}

interface ScopeType {
  min?: ScopeItem[];
  hour?: ScopeItem[];
  day: ScopeItem[];
}

export interface ChildProps {
  preview?: boolean;
}
const defaultIntervalType: string = 'day';
const defaultLimit: number = 365;
const scope: ScopeType = {
  min: [
    {
      label: '1h',
      limit: 60,
    },
    {
      label: '2h',
      limit: 120,
    },
    {
      label: '4h',
      limit: 240,
    },
    {
      label: '6h',
      limit: 360,
    },
    {
      label: '12h',
      limit: 720,
    },
    {
      label: '24h',
      limit: 1440,
    },
  ],
  hour: [
    {
      label: '1d',
      limit: 24,
    },
    {
      label: '3d',
      limit: 72,
    },
    {
      label: '7d',
      limit: 168,
    },
    {
      label: '14d',
      limit: 336,
    },
  ],
  day: [
    {
      label: '1w',
      limit: 7,
    },
    {
      label: '1m',
      limit: 30,
    },
    {
      label: '3m',
      limit: 91,
    },
    {
      label: '6m',
      limit: 182,
    },
    {
      label: '1y',
      limit: 365,
    },
    {
      label: 'All',
      limit: 2000,
    },
  ],
};
export function StockChartTemplate({
  plain,
  preview,
  title,
  subtitle,
  options,
  request,
}: Props) {
  const { t } = useTranslation();
  const bp = useBreakpoint();
  const chart = useRef(null);
  const [data, setData] = useState({
    list: [],
  });
  const [intervalScope, setIntervalScope] = useState<ScopeType>();
  const [intervalType, setIntervalType] = useState<string>(defaultIntervalType);
  const [limit, setLimit] = useState(defaultLimit);

  useHighcharts(chart);

  const combination = ({ type, limit }: { type: string; limit: number }) => {
    if (type) setIntervalType(type);
    if (limit) setLimit(limit);
    getChartData(type, limit);
  };

  const getChartData = useCallback(
    async (intervalType, limit) => {
      setIntervalType(intervalType);
      // @ts-ignore
      chart.current?.chart.showLoading();
      const data = await reqChartData({
        url: request.url,
        query: request.query || {
          limit: preview ? 30 : limit,
          intervalType: intervalType,
        },
      });
      data.list = data.list.reverse();

      setData(data);

      // @ts-ignore
      chart.current?.chart.hideLoading();
    },
    [request.url, request.query, preview],
  );

  useEffect(() => {
    getChartData(defaultIntervalType, defaultLimit);
    if (
      ['/statistics/mining', '/statistics/tps'].some(str =>
        request.url.includes(str),
      )
    ) {
      setIntervalScope(scope);
    } else {
      setIntervalScope({ day: scope.day });
    }
  }, [preview, request.query, request.url, getChartData]);

  const opts = lodash.merge(
    {
      chart: {
        alignTicks: false,
        height: 600,
      },
      credits: {
        enabled: false,
      },
      colors: [
        '#7cb5ec',
        '#434348',
        '#f7a35c',
        '#2b908f',
        '#91e8e1',
        '#90ed7d',
        '#8085e9',
        '#f15c80',
        '#e4d354',
        '#f45b5b',
      ],
      navigator: {
        enabled: true,
      },
      rangeSelector: {
        enabled: true,
        buttons: [],
      },
      scrollbar: {
        enabled: true,
      },
      plotOptions: {
        series: {
          dataGrouping: {
            enabled: false,
            // dateTimeLabelFormats: {
            //   week: ['%A, %b %e, %Y'],
            // },
          },
        },
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              // @ts-ignore
              [0, Highcharts.getOptions().colors[0]],
              [
                1,
                // @ts-ignore
                Highcharts.color(Highcharts.getOptions().colors[0])
                  .setOpacity(0)
                  .get('rgba'),
              ],
            ],
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
        line: {
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
        },
      },
      legend: {
        enabled: options.series.length > 1,
      },
      tooltip: {
        split: false,
        useHTML: true,
        headerFormat: `<table>
            <tr>
              <th colspan="2" style="font-weight: normal;">{point.key}</th>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="padding-bottom: 5px;"></th>
            </tr>
            `,
        pointFormat: `
          <tr><td style="padding-top: 5px;"></td></tr>
          <tr>
            <td style="color: {series.color}; padding-right: 10px;">[ {series.name} ]</td>
            <td style="text-align: right"><b>{point.y}</b></td>  
          </tr>`,
        footerFormat: '</table>',
        shape: 'square',
        shared: true,
      },
      yAxis: {
        opposite: false,
      },
      series: options.series.map((s, i) => ({
        data: request.formatter(data)[i],
      })),
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'viewFullscreen',
              'printChart',
              'separator',
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
            ],
          },
        },
      },
      subtitle: {
        text: getChartsSubTitle(t(translations.highcharts.subtitle)),
      },
    },
    options,
  );
  if (intervalType === 'min' || intervalType === 'hour') {
    opts.rangeSelector.enabled = false;
  }

  if (preview) {
    opts.chart.height = 240;
    opts.chart.zoomType = undefined;
    opts.title = '';
    opts.subtitle = '';
    opts.exporting.enabled = false;
    opts.navigator.enabled = false;
    opts.rangeSelector.enabled = false;
    opts.scrollbar.enabled = false;
  }

  if (bp === 's') {
    opts.chart.height = 500;

    if (preview) {
      opts.chart.height = 360;
    }
  }

  return (
    <>
      {preview || plain ? null : (
        <PageHeader subtitle={subtitle}>{title}</PageHeader>
      )}
      <Card
        style={{
          padding: '1.2857rem',
        }}
      >
        {!preview && (
          <StyledFilterItems>
            <StyledBtnWrap>
              <div>{t(translations.highcharts.options.time)}:</div>
              {intervalScope &&
                Object.keys(intervalScope).map((e, i) => {
                  return (
                    <StyledBtn
                      key={'scopeKey' + i}
                      onClick={() =>
                        combination({
                          type: e,
                          limit:
                            intervalScope[e][intervalScope[e].length - 1].limit,
                        })
                      }
                      style={{
                        background:
                          intervalType === e ? 'rgb(230, 235, 245)' : '',
                      }}
                    >
                      {e}
                    </StyledBtn>
                  );
                })}
            </StyledBtnWrap>

            <StyledBtnWrap>
              <div>{t(translations.highcharts.options.range)}:</div>
              {intervalScope &&
                intervalScope[intervalType].map((e, i) => {
                  return (
                    <StyledBtn
                      key={'scopeLimit' + i}
                      onClick={() =>
                        combination({
                          type: intervalType,
                          limit: e.limit,
                        })
                      }
                      style={{
                        background:
                          limit === e.limit ? 'rgb(230, 235, 245)' : '',
                      }}
                    >
                      {e.label}
                    </StyledBtn>
                  );
                })}
            </StyledBtnWrap>
          </StyledFilterItems>
        )}
        <HighchartsWrapper>
          <HighchartsReact
            constructorType={'stockChart'}
            highcharts={Highcharts}
            options={opts}
            ref={chart}
          />
        </HighchartsWrapper>
      </Card>
    </>
  );
}
const StyledFilterItems = styled.div`
  display: flex;
  position: absolute;
  z-index: 11;
  top: 62px;
  left: 40px;
  @media (max-width: 1240px) {
    top: 92px;
  }
  @media (max-width: 770px) {
    flex-direction: column;
    gap: 10px;
    top: 15px;
    left: 15px;
  }
`;

const StyledBtnWrap = styled.div`
  display: flex;
  gap: 3px;
  margin-right: 20px;
`;

const StyledBtn = styled.div`
  background: rgb(247, 247, 247);
  width: fit-content;
  padding: 2px 7px;
  border-radius: 5px;
  font-size: 12px;
  &:hover {
    background: #eee;
  }
`;

const HighchartsWrapper = styled.div`
  @media (max-width: 770px) {
    margin-top: 60px;
  }
`;
