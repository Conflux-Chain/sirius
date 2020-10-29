import React from 'react';
import { Translation } from 'react-i18next';
import numeral from 'numeral';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import { Status } from '../../app/components/Status/Loadable';
import { CountDown } from '../../app/components/CountDown/Loadable';
import { formatString, formatNumber, fromDripToCfx } from '../../utils/';

export const hash = {
  title: (
    <Translation>
      {t => t(translations.general.table.transaction.hash)}
    </Translation>
  ),
  dataIndex: 'hash',
  key: 'hash',
  width: 1,
  render: (value, row: any) => {
    return (
      <StyledTransactionHashWrapper>
        {row.status !== 0 && <Status type={row.status} variant="dot" />}
        <Link href={`/transaction/${value}`}>
          <Text span hoverValue={value}>
            {formatString(value, 'hash')}
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
  render: value => (
    <Link href={`/address/${value}`}>
      <Text span hoverValue={value}>
        {formatString(value, 'address')}
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
            {formatString(value, 'address')}
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
    <Text span hoverValue={`${numeral(value).format('0,0')} drip`}>
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
    <Text span hoverValue={`${numeral(value).format('0,0')} drip`}>
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
