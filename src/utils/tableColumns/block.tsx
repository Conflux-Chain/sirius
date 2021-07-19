import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import { Text } from 'app/components/Text/Loadable';
import { Link } from 'app/components/Link/Loadable';
import { formatNumber, getPercent, fromDripToCfx, toThousands } from 'utils/';
import imgPivot from 'images/pivot.svg';
import { AddressContainer } from 'app/components/AddressContainer';
import { ColumnAge } from './utils';
import { Progress } from '@jnoodle/antd';
import BigNumber from 'bignumber.js';

export const epoch = {
  title: (
    <Translation>{t => t(translations.general.table.block.epoch)}</Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  width: 1,
  render: value => <Link href={`/epoch/${value}`}>{value}</Link>,
};

export const position = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.position)}
    </Translation>
  ),
  dataIndex: 'blockIndex',
  key: 'blockIndex',
  width: 1,
};

export const txns = {
  title: (
    <Translation>{t => t(translations.general.table.block.txns)}</Translation>
  ),
  dataIndex: 'transactionCount',
  key: 'transactionCount',
  width: 1,
  render: formatNumber,
};

export const hashWithPivot = {
  title: (
    <Translation>{t => t(translations.general.table.block.hash)}</Translation>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: (value, row: any) => {
    let pivotTag: React.ReactNode = null;
    if (row.pivotHash === row.hash) {
      pivotTag = <img className="img" src={imgPivot} alt="pivot" />;
    }
    return (
      <StyledHashWrapper>
        <Link href={`/block/${value}`}>
          <Text span hoverValue={value}>
            <SpanWrap>{value}</SpanWrap>
          </Text>
        </Link>
        {pivotTag}
      </StyledHashWrapper>
    );
  },
};

export const miner = {
  title: (
    <Translation>{t => t(translations.general.table.block.miner)}</Translation>
  ),
  dataIndex: 'miner',
  key: 'miner',
  width: 1,
  render: value => <AddressContainer value={value} />,
};

export const avgGasPrice = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.avgGasPrice)}
    </Translation>
  ),
  dataIndex: 'avgGasPrice',
  key: 'avgGasPrice',
  width: 1,
  render: value => (
    <Text span hoverValue={`${toThousands(value)} drip`}>
      {`${formatNumber(value)} drip`}
    </Text>
  ),
};

export const gasUsedPercent = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.gasUsedPercent)}
    </Translation>
  ),
  dataIndex: 'gasUsed',
  key: 'gasUsed',
  width: 1,
  render: (value, row: any) => {
    if (value) {
      return getPercent(row.gasUsed, row.gasLimit);
    } else {
      return '--';
    }
  },
};

export const gasUsedPercentWithProgress = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.gasUsedPercent)}
    </Translation>
  ),
  dataIndex: 'gasUsed',
  key: 'gasUsed',
  width: 1,
  render: (value, row: any) => {
    const gasUsed = new BigNumber(row.gasUsed);
    const percent = Number(
      gasUsed.dividedBy(row.gasLimit).multipliedBy(100).toFixed(2),
    );

    if (value) {
      return (
        <StyledGasPercentWrapper>
          <div className="gas-detail">
            {toThousands(gasUsed.toFixed())}{' '}
            <span className="gas-detail-percent">
              ({getPercent(row.gasUsed, row.gasLimit)})
            </span>
          </div>
          <Progress
            percent={percent}
            size="small"
            showInfo={false}
            strokeWidth={2}
            strokeColor="#1e3de4"
            trailColor="#eeeeee"
          />
        </StyledGasPercentWrapper>
      );
    } else {
      return '--';
    }
  },
};

export const reward = {
  title: (
    <Translation>{t => t(translations.general.table.block.reward)}</Translation>
  ),
  dataIndex: 'totalReward',
  key: 'totalReward',
  width: 1,
  render: value =>
    value ? (
      <Text span hoverValue={`${fromDripToCfx(value, true)} CFX`}>
        {`${fromDripToCfx(value)} CFX`}
      </Text>
    ) : (
      '--'
    ),
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat });

export const difficulty = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.difficulty)}
    </Translation>
  ),
  dataIndex: 'difficulty',
  key: 'difficulty',
  width: 1,
  render: formatNumber,
};

export const gasLimit = {
  title: (
    <Translation>
      {t => t(translations.general.table.block.gasLimit)}
    </Translation>
  ),
  dataIndex: 'gasLimit',
  key: 'gasLimit',
  width: 1,
  render: formatNumber,
};

const StyledHashWrapper = styled.span`
  display: flex;
  align-items: center;

  .img {
    width: 3rem;
    height: 1.4286rem;
    margin-left: 0.5714rem;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 100px;
  overflow: hidden;
  vertical-align: bottom;
`;

const StyledGasPercentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .gas-detail {
    margin-bottom: -10px;
  }

  .gas-detail-percent {
    color: #999999;
    font-size: 12px;
  }
`;
