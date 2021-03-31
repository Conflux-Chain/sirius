import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import { defaultTokenIcon } from '../../constants';
import { formatString, formatNumber } from '..';
import { AddressContainer } from '../../app/components/AddressContainer';
import { formatAddress } from '../cfx';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

export const number = {
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.number)}
    </Translation>
  ),
  key: 'epochNumber',
  render: (value, row, index) => {
    return index + 1;
  },
};

export const name = {
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.name)}
    </Translation>
  ),
  key: 'blockIndex',
  render: row => (
    <StyledIconWrapper>
      <img src={row?.icon || defaultTokenIcon} alt="contract icon" />
      <Link href={`/address/${formatAddress(row.address)}`}>
        <Text span hoverValue={row?.name}>
          {formatString(`${row?.name}`, 28)}
        </Text>
      </Link>
    </StyledIconWrapper>
  ),
};

export const contract = {
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.address)}
    </Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  render: value => <AddressContainer value={value} />,
};

export const transactionCount = {
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.transactionCount)}
    </Translation>
  ),
  dataIndex: 'transactionCount',
  key: 'transactionCount',
  render: value => <span>{formatNumber(value, { withUnit: false })}</span>,
};

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.5714rem;
  }
`;
