import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import { Loading } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { formatBalance } from '../../../utils';
import useSWR, { responseInterface } from 'swr';
import { appendApiPrefix } from '../../../utils/api';

interface Props {
  width?: number | string;
  indicator?: string;
  isThumb?: boolean;
  small?: boolean;
}

export const PieChart = ({
  width = '100%',
  indicator = 'circulating',
  isThumb = false,
}: Props) => {
  const small = width < 500;
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<any[]>([]);
  const [sum, setSum] = useState<any>('0');
  const [color, setColor] = useState<string[]>([
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4',
    '#ea7ccc',
  ]);
  const {
    data: resData,
    error,
  }:
    | responseInterface<any, any>
    | responseInterface<Response, any> = useSWR(indicator, () =>
    fetch(appendApiPrefix(`/supply`)),
  );

  const isLoading = !resData && !error;

  useEffect(() => {
    indicator &&
      resData &&
      resData
        .clone()
        .json()
        .then(data => {
          if (data) {
            switch (indicator) {
              case 'circulating':
                setChartData([
                  {
                    value: new BigNumber(data.totalCirculating)
                      .minus(new BigNumber(data.nullAddressBalance))
                      .toString(),
                    name: t(`charts.${indicator}.labelOthers`),
                  },
                  {
                    value: new BigNumber(data.nullAddressBalance).toString(),
                    name: t(`charts.${indicator}.labelZeroAddress`),
                  },
                ]);
                setSum(
                  formatBalance(data.totalCirculating, 18, false, {
                    withUnit: false,
                    keepDecimal: false,
                  }),
                );
                setColor(['#3ba272', '#fac858']);
                break;
              case 'issued':
                setChartData([
                  {
                    value: new BigNumber(data.fourYearUnlockBalance).toString(),
                    name: t(`charts.${indicator}.labelFourYearUnlockBalance`),
                  },
                  {
                    value: new BigNumber(data.twoYearUnlockBalance).toString(),
                    name: t(`charts.${indicator}.labelTwoYearUnlockBalance`),
                  },
                  {
                    value: new BigNumber(data.totalCirculating).toString(),
                    name: t(`charts.${indicator}.labelTotalCirculating`),
                  },
                ]);
                setSum(
                  formatBalance(data.totalIssued, 18, false, {
                    withUnit: false,
                    keepDecimal: false,
                  }),
                );
                setColor(['#9a60b4', '#fc8452', '#3ba272']);
                break;
              default:
                break;
            }
          }
        })
        .catch(e => {
          console.error(e);
        });
  }, [indicator, resData, t]);

  return (
    <Container
      style={{ width: isThumb ? '100%' : width }}
      small={small}
      isThumb={isThumb}
    >
      <Title>{t(`charts.${indicator}.title`)}</Title>
      {!isThumb ? (
        <Description>{t(`charts.${indicator}.description`)}</Description>
      ) : null}
      {isLoading ? (
        <LoadingContainer>
          <Loading />
        </LoadingContainer>
      ) : error ? (
        <div>{t('general.errorOccurred')}</div>
      ) : (
        <ReactECharts
          style={{
            height: isThumb ? '100%' : 600,
            width: '100%',
            minWidth: 300,
            minHeight: 170,
          }}
          option={{
            tooltip: {
              show: !isThumb,
              trigger: 'item',
              formatter: function (params) {
                return `${params.data.name}: ${formatBalance(
                  params.data.value,
                  18,
                  false,
                  {
                    withUnit: false,
                    keepDecimal: false,
                  },
                )} CFX`;
              },
            },
            title: {
              show: !isThumb,
              subtext: `${t(`charts.${indicator}.title`)}: ${sum} CFX`,
              bottom: '0',
            },
            legend: {
              show: !isThumb,
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                color: color,
                name: t(`charts.${indicator}.title`),
                type: 'pie',
                radius: isThumb ? '80%' : '70%',
                data: chartData,
                label: {
                  show: !isThumb,
                },
                emphasis: {
                  show: !isThumb,
                  scale: !isThumb,
                },
              },
            ],
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: ${(props: Props) =>
    props.isThumb ? '8px 20px' : props.small ? '8px' : '24px'};
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
  border-radius: 5px;
  min-height: ${props => (props.small || props.isThumb ? '200px' : '250px')};
  background-color: #fff;
`;

const LoadingContainer = styled.div`
  position: absolute;
  top: calc(50% - 30px);
  width: 40px;
  height: 40px;
  left: calc(50% - 20px);
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.1429rem;
  color: black;
  line-height: 2.1429rem;
`;

const Description = styled.div`
  font-weight: bold;
  line-height: 1.2143rem;
  font-size: 0.8571rem;
  color: #4a6078;
  font-weight: 500;
  margin-bottom: 1rem;
`;
