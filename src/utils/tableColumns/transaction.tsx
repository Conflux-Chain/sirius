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
            {formatString(value, 'hash')}
          </Text>
        </Link>
      </StyledTransactionHashWrapper>
    );
  },
};

const getContractName = (value, row, type) => {
  if (type === 'from' && row.fromContractInfo && row.fromContractInfo.name)
    return formatString(row.fromContractInfo.name, 'tag');
  else if (type === 'to' && row.toContractInfo && row.toContractInfo.name)
    return formatString(row.toContractInfo.name, 'tag');
  else if (type === 'to' && row.contractInfo && row.contractInfo.name)
    return formatString(row.contractInfo.name, 'tag');
  else return formatString(value, 'address');
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
    <Link href={`/address/${value}`}>
      <Text span hoverValue={value}>
        {getContractName(value, row, 'from')}
      </Text>
    </Link>
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
  render: (value, row) => {
    const text = (
      <Translation>
        {t => t(translations.transaction.contractCreation)}
      </Translation>
    );
    // contract creation
    if (value === null) {
      return row.contractCreated ? (
        <Link href={`/address/${row.contractCreated}`}>
          <Text span hoverValue={row.contractCreated}>
            {text}
          </Text>
        </Link>
      ) : (
        // contract creation fail, no link
        text
      );
    } else {
      return (
        <Link href={`/address/${value}`}>
          <Text span hoverValue={value}>
            {getContractName(value, row, 'to')}
          </Text>
        </Link>
      );
    }
  },
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
