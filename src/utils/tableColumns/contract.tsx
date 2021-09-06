import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Text } from '../../app/components/Text/Loadable';
import { formatNumber, formatString } from '..';
import { AddressContainer } from '../../app/components/AddressContainer';
import { ContentWrapper } from './utils';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

export const number = (page = 1, pageSize = 10) => ({
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.number)}
    </Translation>
  ),
  dataIndex: 'epochNumber',
  key: 'epochNumber',
  render: (value, row, index) => {
    return (page - 1) * pageSize + index + 1;
  },
});

export const name = {
  title: (
    <Translation>
      {t => t(translations.general.table.contracts.name)}
    </Translation>
  ),
  key: 'blockIndex',
  render: row => (
    <StyledIconWrapper>
      <span>
        <Text span hoverValue={row?.name}>
          {formatString(`${row?.name}`, 28)}
        </Text>
      </span>
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
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.contracts.transactionCount)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'transactionCount',
  key: 'transactionCount',
  sortable: true,
  render: value => (
    <ContentWrapper right>
      <span>{formatNumber(value, { withUnit: false })}</span>
    </ContentWrapper>
  ),
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
