import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '@cfxjs/react-ui';
import { Text } from '../../app/components/Text/Loadable';
import numeral from 'numeral';

const renderTextEllipsis = value => {
  return (
    <Text span maxWidth="5.7143rem" hoverValue={value}>
      {value}
    </Text>
  );
};

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.5714rem;
  }
`;

export const number = {
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  key: 'epochNumber',
  width: 80,
  render: (value, row, index) => {
    return index + 1;
  },
};

export const token = {
  title: (
    <Translation>{t => t(translations.general.table.token.token)}</Translation>
  ),
  key: 'blockIndex',
  render: row => (
    <StyledIconWrapper>
      <img src={row.icon} alt="token icon" />
      <Link href={`/token/${row.address}`}>
        {row.name} ({row.symbol})
      </Link>
    </StyledIconWrapper>
  ),
};

export const transfer = {
  title: (
    <Translation>
      {t => t(translations.general.table.token.transfer)}
    </Translation>
  ),
  dataIndex: 'transferCount',
  key: 'transferCount',
};

export const totalSupply = {
  title: (
    <Translation>
      {t => t(translations.general.table.token.totalSupply)}
    </Translation>
  ),
  dataIndex: 'totalSupply',
  key: 'totalSupply',
  render: value => renderTextEllipsis(numeral(value).format('0,0')),
};

export const holders = {
  title: (
    <Translation>
      {t => t(translations.general.table.token.holders)}
    </Translation>
  ),
  dataIndex: 'accountTotal',
  key: 'accountTotal',
  render: value => numeral(value).format('0,0'),
};

export const contract = {
  title: (
    <Translation>
      {t => t(translations.general.table.token.contract)}
    </Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  render: value => (
    <Link href={`/address/${value}`}>{renderTextEllipsis(value)}</Link>
  ),
};
