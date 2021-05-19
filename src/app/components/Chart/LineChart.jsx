import React from 'react';
import { Loading } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Line,
  LineChart as Chart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import dayjs from 'dayjs';
import styled from 'styled-components';
import usePlot from './usePlot';
import { formatNumber } from '../../../utils';
import { trackEvent } from '../../../utils/ga';
import { ScanEvent } from '../../../utils/gaConstants';
import { DataZoomLineChart } from './Loadable';
import _ from 'lodash';
import { cfxTokenTypes } from '../../../utils/constants';
import { Link } from 'react-router-dom';
import imgInfo from '../../../images/info.svg';
import { Tooltip as ToolTipInfo } from 'app/components/Tooltip/Loadable';

const DURATIONS = [
  ['hour', '1H'],
  ['day', '1D'],
  ['month', '1M'],
  ['all', 'ALL'],
];

export const LineChart = ({
  widthRatio = '',
  width = 500,
  minHeight = 500,
  indicator = 'blockTime',
  isThumb = false,
  withDetailLink = false,
  tokenInfo = {
    name: '',
    address: '',
    type: '',
  },
}) => {
  const { t } = useTranslation();
  const clientWidth = document.body.clientWidth;
  const small = width < 500;
  const padding = small ? 16 : 48;
  // get the max x grids which most suitable chart width
  let NUM_X_GRID = Math.floor(Math.min(clientWidth, 1368) / 50);
  if (NUM_X_GRID < 7) NUM_X_GRID = 7;
  if (small) NUM_X_GRID = 6;

  const hasDurationFilter = ![
    'dailyTransaction',
    'dailyTransactionCFX',
    'dailyTransactionTokens',
    'cfxHoldingAccounts',
    'accountGrowth',
    'activeAccounts',
    'contractAmount',
    'contractGrowth',
    'tokenAnalysis',
  ].includes(indicator);

  const chartWidth =
    width - padding - (hasDurationFilter ? (small ? 50 : 70) : 0);
  const chartHeight = small ? chartWidth * 0.45 : chartWidth * 0.35;

  const limit = [
    'dailyTransaction',
    'dailyTransactionCFX',
    'dailyTransactionTokens',
    'cfxHoldingAccounts',
    'accountGrowth',
    'activeAccounts',
    'contractAmount',
    'contractGrowth',
    'tokenAnalysis', // without thumb
  ].includes(indicator)
    ? 365
    : 31;

  const {
    plot,
    isError,
    isLoading,
    setDuration,
    duration,
    axisFormat,
    popupFormat,
  } = usePlot(
    'day',
    NUM_X_GRID,
    indicator,
    limit,
    indicator === 'tokenAnalysis' ? tokenInfo.address : '',
  );

  const initialDomain = {
    min: {
      blockTime: 0,
      tps: 0,
      difficulty: 0,
      hashRate: 0,
      dailyTransaction: 0,
      dailyTransactionCFX: 0,
      dailyTransactionTokens: 0,
      cfxHoldingAccounts: 0,
      accountGrowth: 0,
      activeAccounts: 0,
      contractAmount: 0,
      contractGrowth: 0,
    },
    max: {
      blockTime: 'auto',
      tps: 'auto',
      difficulty: 'auto',
      hashRate: 'auto',
      dailyTransaction: 'auto',
      dailyTransactionCFX: 'auto',
      dailyTransactionTokens: 'auto',
      cfxHoldingAccounts: 'auto',
      accountGrowth: 'auto',
      activeAccounts: 'auto',
      contractAmount: 'auto',
      contractGrowth: 'auto',
    },
  };

  // y axis data range
  const domain =
    plot && plot.length > 0
      ? plot.reduce((acc, cur) => {
          let dataKey = indicator;
          switch (indicator) {
            case 'blockTime':
              break;
            case 'tps':
              break;
            case 'difficulty':
            case 'hashRate':
              acc.min[indicator] = Math.min(
                +acc.min[indicator] || Infinity,
                +cur[indicator] * 0.7,
              );
              break;
            case 'dailyTransaction':
              dataKey = 'txCount';
              break;
            case 'dailyTransactionCFX':
            case 'dailyTransactionTokens':
              dataKey = 'txnCount';
              break;
            case 'cfxHoldingAccounts':
              dataKey = 'holderCount';
              break;
            case 'accountGrowth':
            case 'activeAccounts':
              dataKey = 'cnt';
              break;
            case 'contractAmount':
            case 'contractGrowth':
              dataKey = 'contractCount';
              break;
            default:
              break;
          }

          acc.max[indicator] = Math.max(
            +acc.max[indicator] || 0,
            +cur[dataKey] * 1.1,
          );

          return acc;
        }, initialDomain)
      : initialDomain;

  const strokeColor = () => {
    return '#1E54FF';
    // switch (indicator) {
    //   case 'dailyTransaction':
    //     // because of reverse
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1]['txCount'] - plot[0]['txCount'] <= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    //   case 'dailyTransactionCFX':
    //   case 'dailyTransactionTokens':
    //     // because of reverse
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1]['txnCount'] - plot[0]['txnCount'] <= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    //   case 'cfxHoldingAccounts':
    //     // because of reverse
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1]['holderCount'] - plot[0]['holderCount'] <= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    //   case 'accountGrowth':
    //   case 'activeAccounts':
    //     // because of reverse
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1]['cnt'] - plot[0]['cnt'] <= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    //   case 'contractAmount':
    //     // because of reverse
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1]['contractCount'] - plot[0]['contractCount'] <= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    //   default:
    //     return plot &&
    //       plot.length > 0 &&
    //       plot[plot.length - 1][indicator] - plot[0][indicator] >= 0
    //       ? '#1E54FF'
    //       : '#FA5D8E';
    // }
  };

  // x axis date format
  const xAxisFormat = ({ x, y, payload }) => {
    const d = hasDurationFilter
      ? dayjs.unix(payload.value)
      : dayjs(payload.value);
    const [row1, row2] = axisFormat.split('\n');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={17} y={10} dy={16} textAnchor="end">
          {row2 ? (
            <>
              <tspan x={17} dy={5}>
                {d.format(row1)}
              </tspan>
              <tspan x={17} dy={16}>
                {d.format(row2)}
              </tspan>
            </>
          ) : (
            <tspan x={15} dy={5}>
              {d.format(row1)}
            </tspan>
          )}
        </text>
      </g>
    );
  };

  // y axis number format
  const yAxisFormat = value => {
    return formatNumber(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <TooltipWrapper>
          <p className="label">
            {hasDurationFilter
              ? dayjs.unix(label).format(popupFormat)
              : dayjs(label).format(popupFormat)}
          </p>
          <p className="desc">
            {formatNumber(payload[0].value)}
            {indicator === 'blockTime' ? 's' : ''}
          </p>
        </TooltipWrapper>
      );
    }

    return null;
  };

  const xAxisKey = () => {
    switch (indicator) {
      case 'dailyTransaction':
      case 'cfxHoldingAccounts':
        return 'statDay';
      case 'dailyTransactionCFX':
      case 'dailyTransactionTokens':
      case 'accountGrowth':
      case 'activeAccounts':
        return 'day';
      case 'contractAmount':
      case 'contractGrowth':
        return 'statDay';
      case 'tokenAnalysis':
        return 'day';
      default:
        return 'timestamp';
    }
  };

  const lineKey = () => {
    switch (indicator) {
      case 'dailyTransaction':
        return 'txCount';
      case 'dailyTransactionCFX':
      case 'dailyTransactionTokens':
        return 'txnCount';
      case 'cfxHoldingAccounts':
        return 'holderCount';
      case 'accountGrowth':
      case 'activeAccounts':
        return 'cnt';
      case 'contractAmount':
      case 'contractGrowth':
        return 'contractCount';
      case 'tokenAnalysis':
        return tokenInfo.type === cfxTokenTypes.erc20
          ? [
              'transferAmount',
              'transferCount',
              'uniqueReceiver',
              'uniqueSender',
            ]
          : ['transferCount', 'uniqueReceiver', 'uniqueSender'];
      default:
        return indicator;
    }
  };

  if (isError) {
    return (
      <Container
        style={{ width: isThumb ? '100%' : widthRatio ? widthRatio : width }}
        small={small}
        isThumb={isThumb}
      >
        <Title>{t(`charts.${indicator}.title`)}</Title>
        <div>{t('general.errorOccurred')}</div>
      </Container>
    );
  } else {
    return (
      <Container
        style={{ width: isThumb ? '100%' : widthRatio ? widthRatio : width }}
        small={small}
        isThumb={isThumb}
      >
        <Title>
          {withDetailLink ? (
            <>
              <Link to={`/chart/${indicator}`} className="chart-link">
                {t(`charts.${indicator}.title`)}
              </Link>
              <ToolTipInfo
                hoverable
                text={t(`charts.${indicator}.description`)}
                placement="top"
              >
                <img src={imgInfo} alt="tips" />
              </ToolTipInfo>
            </>
          ) : (
            t(`charts.${indicator}.title`)
          )}
        </Title>
        {!isThumb && t(`charts.${indicator}.description`) && !withDetailLink ? (
          <Description>
            {t(
              `charts.${indicator}.description`,
              indicator === 'tokenAnalysis' ? { token: tokenInfo.name } : null,
            )}
          </Description>
        ) : null}
        {isLoading ? (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        ) : null}
        {[
          'dailyTransaction',
          'dailyTransactionCFX',
          'dailyTransactionTokens',
          'cfxHoldingAccounts',
          'accountGrowth',
          'activeAccounts',
          'contractAmount',
          'contractGrowth',
          'tokenAnalysis',
        ].includes(indicator) && !isThumb ? (
          <DataZoomLineChart
            width={widthRatio ? widthRatio : width}
            minHeight={minHeight}
            indicator={indicator}
            dateKey={xAxisKey()}
            valueKey={lineKey()}
            data={plot}
          />
        ) : (
          <ResponsiveContainer
            width={isThumb ? '100%' : chartWidth}
            height={isThumb ? 180 : chartHeight}
          >
            <Chart
              data={
                plot && plot.length > 0
                  ? _.cloneDeep(plot).sort((a, b) =>
                      a[xAxisKey()].localeCompare(b[xAxisKey()]),
                    )
                  : _.cloneDeep(plot)
              }
              margin={
                isThumb
                  ? {
                      left: 2,
                      right: 2,
                      top: 10,
                      bottom: 10,
                    }
                  : {
                      left: 10,
                      right: 20,
                      bottom: 20,
                    }
              }
            >
              <CartesianGrid stroke="#eee" />
              {plot ? (
                <XAxis
                  hide={isThumb}
                  dataKey={xAxisKey()}
                  tick={xAxisFormat}
                  interval={hasDurationFilter ? 0 : Math.floor(30 / NUM_X_GRID)}
                  reversed={false}
                  stroke="#333333"
                />
              ) : null}
              <YAxis
                hide={isThumb}
                stroke="#333333"
                tickFormatter={yAxisFormat}
                domain={[domain.min[indicator], domain.max[indicator]]}
                width={
                  [
                    'difficulty',
                    'hashRate',
                    'dailyTransaction',
                    'dailyTransactionCFX',
                    'dailyTransactionTokens',
                    'cfxHoldingAccounts',
                    'accountGrowth',
                    'activeAccounts',
                    'contractAmount',
                    'contractGrowth',
                  ].includes(indicator)
                    ? 60
                    : 50
                }
              />
              <Line
                type="linear"
                dataKey={lineKey()}
                stroke={strokeColor()}
                strokeWidth={2}
                dot={!isThumb}
              />
              {!isThumb ? <Tooltip content={<CustomTooltip />} /> : null}
            </Chart>
          </ResponsiveContainer>
        )}
        {hasDurationFilter && !isThumb ? (
          <Buttons small={small}>
            {DURATIONS.map(([d, key]) => (
              <Button
                key={key}
                small={small}
                active={d === duration}
                onClick={() => {
                  // ga
                  trackEvent({
                    category: ScanEvent.stats.category,
                    action:
                      ScanEvent.stats.action[`${indicator}IntervalChange`],
                    label: d,
                  });
                  setDuration(d);
                }}
              >
                {key}
              </Button>
            ))}
          </Buttons>
        ) : null}
      </Container>
    );
  }
};

const Container = styled.div`
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  padding: ${props =>
    props.isThumb ? '8px 20px' : props.small ? '8px' : '24px'};
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(20, 27, 50, 0.12);
  border-radius: 5px;
  min-height: ${props => (props.small || props.isThumb ? '200px' : '230px')};
  background-color: #fff;

  svg {
    cursor: pointer;
    font-size: 12px;
  }
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

  img {
    width: 18px;
    margin-left: 5px;
    margin-bottom: 3px;
  }
`;

const Description = styled.div`
  font-weight: bold;
  line-height: 1.2143rem;
  font-size: 0.8571rem;
  color: #4a6078;
  font-weight: 500;
  margin-bottom: ${props => (props.minHeight < 300 ? '10px' : '1rem')};
`;

const Buttons = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 1.5rem;
  top: ${props => (props.small ? '1.5rem' : '5rem')};
  box-sizing: content-box;
`;

const Button = styled.button`
  cursor: pointer;
  width: ${props => (props.small ? '27px' : '32px')};
  height: ${props => (props.small ? '16px' : '20px')};
  border: 1px solid rgba(59, 85, 145, 0.2);
  color: #3b5591;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.7143rem;
  margin-bottom: 0.5714rem;
  background: ${props => (props.active ? 'rgba(59, 85, 145, 0.2)' : '#ffffff')};
  box-shadow: 0.8571rem 0.5714rem 1.7143rem -0.8571rem rgba(6, 6, 8, 0.12);
  border-radius: 0.2857rem;
`;

const TooltipWrapper = styled.div`
  padding: 5px 10px;
  color: #fff;
  font-size: 10px;
  background-color: rgba(113, 143, 245, 0.8);

  p {
    margin: 0;
  }
  .desc {
    font-size: 12px;
    font-weight: bold;
  }
`;
