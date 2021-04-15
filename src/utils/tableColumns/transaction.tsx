import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import { Status } from '../../app/components/Status/Loadable';
import { CountDown } from '../../app/components/CountDown/Loadable';
import {
  formatString,
  formatNumber,
  fromDripToCfx,
  toThousands,
} from '../../utils/';
import { AddressContainer } from '../../app/components/AddressContainer';

const StyledHashWrapper = styled.span`
  padding-left: 16px;
`;

export const hash = {
  title: (
    <StyledHashWrapper>
      <Translation>
        {t => t(translations.general.table.transaction.hash)}
      </Translation>
    </StyledHashWrapper>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: (value, row: any) => {
    return (
      <StyledTransactionHashWrapper>
        <StyledStatusWrapper
          className={clsx({
            show: row.status !== 0,
          })}
        >
          <Status type={row.status} variant="dot">
            {row.txExecErrorMsg}
          </Status>
        </StyledStatusWrapper>
        <Link href={`/transaction/${value}`}>
          <Text span hoverValue={value}>
            <SpanWrap>{value}</SpanWrap>
          </Text>
        </Link>
      </StyledTransactionHashWrapper>
    );
  },
};

export const from = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.from)}
    </Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  width: 1,
  render: (value, row) => (
    <AddressContainer
      value={value}
      alias={row.fromContractInfo ? row.fromContractInfo.name : ''}
      contractCreated={row.contractCreated}
    />
  ),
};

export const to = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.to)}
    </Translation>
  ),
  dataIndex: 'to',
  key: 'hash',
  width: 1,
  render: (value, row) => (
    <AddressContainer
      value={value}
      alias={
        row.toContractInfo
          ? row.toContractInfo.name
          : row.contractInfo
          ? row.contractInfo.name
          : ''
      }
      contractCreated={row.contractCreated}
    />
  ),
};

export const value = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.value)}
    </Translation>
  ),
  dataIndex: 'value',
  key: 'value',
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

export const gasPrice = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.gasPrice)}
    </Translation>
  ),
  dataIndex: 'gasPrice',
  key: 'gasPrice',
  width: 1,
  render: value => (
    <Text span hoverValue={`${toThousands(value)} drip`}>
      {`${formatNumber(value)} drip`}
    </Text>
  ),
};

export const gasFee = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.gasFee)}
    </Translation>
  ),
  dataIndex: 'gasFee',
  key: 'gasFee',
  width: 1,
  render: value => (
    <Text span hoverValue={`${toThousands(value)} drip`}>
      {`${formatNumber(value)} drip`}
    </Text>
  ),
};

export const age = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.age)}
    </Translation>
  ),
  dataIndex: 'syncTimestamp',
  key: 'syncTimestamp',
  width: 1,
  render: value => <CountDown from={value} />,
};

const StyledTransactionHashWrapper = styled.span`
  display: flex;
  align-items: center;

  .status {
    margin-right: 0.5714rem;
  }
`;

const StyledStatusWrapper = styled.span`
  visibility: hidden;
  &.show {
    visibility: visible;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 100px;
  overflow: hidden;
  vertical-align: bottom;
`;
