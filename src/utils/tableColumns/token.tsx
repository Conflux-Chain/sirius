import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import queryString from 'query-string';
import { media } from '../../styles/media';
import { CountDown } from '../../app/components/CountDown/Loadable';
import { defaultTokenIcon } from '../../constants';
import { formatBalance, formatNumber, formatString } from '../../utils';
import imgArrow from 'images/token/arrow.svg';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';
import { AddressContainer } from '../../app/components/AddressContainer';

const renderAddress = (value, row, type?: 'to' | 'from') => {
  const { accountAddress } = queryString.parse(window.location.search);
  const filter = (accountAddress as string) || '';
  let alias = '';
  if (type === 'from')
    alias = row.fromContractInfo ? row.fromContractInfo.name : '';
  else if (type === 'to')
    alias = row.toContractInfo
      ? row.toContractInfo.name
      : row.contractInfo
      ? row.contractInfo.name
      : '';

  return (
    <FromWrap>
      <AddressContainer
        value={value}
        alias={alias}
        contractCreated={row.contractCreated}
      />
      {type === 'from' && (
        <ImgWrap src={!filter ? imgArrow : filter === value ? imgOut : imgIn} />
      )}
    </FromWrap>
  );
};

export const number = (page, pageSize) => ({
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  key: 'epochNumber',
  render: (value, row, index) => {
    return (page - 1) * pageSize + index + 1;
  },
});

export const token = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.token)}</Translation>
  ),
  key: 'blockIndex',
  render: row => {
    return (
      <StyledIconWrapper>
        <img src={row?.icon || defaultTokenIcon} alt="token icon" />
        <Link href={`/token/${row.address}`}>
          <Translation>
            {t => (
              <Text
                span
                hoverValue={`${
                  row?.name || t(translations.general.notAvailable)
                } (${row?.symbol || t(translations.general.notAvailable)})`}
              >
                {formatString(
                  `${row?.name || t(translations.general.notAvailable)} (${
                    row?.symbol || t(translations.general.notAvailable)
                  })`,
                  28,
                )}
              </Text>
            )}
          </Translation>
        </Link>
      </StyledIconWrapper>
    );
  },
};

export const price = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.price)}</Translation>
  ),
  dataIndex: 'price',
  key: 'price',
  render: value => (
    <span>{value != null ? `$ ${formatNumber(value || 0)}` : '-'}</span>
  ),
};

export const marketCap = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.marketCap)}
    </Translation>
  ),
  dataIndex: 'totalPrice',
  key: 'totalPrice',
  render: value => (
    <span>
      {value != null && value > 0 ? `$ ${formatNumber(value || 0)}` : '-'}
    </span>
  ),
};
export const transfer = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.transfer)}
    </Translation>
  ),
  dataIndex: `transferCount`,
  key: `transferCount`,
  render: value => <span>{formatNumber(value)}</span>,
};

export const totalSupply = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.totalSupply)}
    </Translation>
  ),
  dataIndex: 'totalSupply',
  key: 'totalSupply',
  render: (value, row) => (
    <Text span hoverValue={formatBalance(value, row.decimals, true)}>
      {formatBalance(value, row.decimals)}
    </Text>
  ),
};

export const holders = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.holders)}
    </Translation>
  ),
  dataIndex: 'holderCount',
  key: 'holderCount',
  render: value => <span>{formatNumber(value)}</span>,
};

export const contract = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.contract)}
    </Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  render: value => <AddressContainer value={value} />,
};

// token detail columns
export const txnHash = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.txnHash)}
    </Translation>
  ),
  dataIndex: 'transactionHash',
  key: 'transactionHash',
  render: value => (
    <Link href={`/transaction/${value}`}>
      <Text span hoverValue={value}>
        {formatString(value, 'hash')}
      </Text>
    </Link>
  ),
};

export const age = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.age)}</Translation>
  ),
  dataIndex: 'syncTimestamp',
  key: 'age',
  render: value => <CountDown from={value} />,
};

export const quantity = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.quantity)}
    </Translation>
  ),
  dataIndex: 'value',
  key: 'value',
  render: (value, row, index, opt?) => {
    const decimals = opt
      ? opt.decimals
      : row.token?.decimals || row.token?.decimal || 0;
    return value ? (
      <Text span hoverValue={formatBalance(value, decimals, true)}>
        {formatBalance(value, decimals)}
      </Text>
    ) : (
      '--'
    );
  },
};

export const to = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.to)}</Translation>
  ),
  dataIndex: 'to',
  key: 'to',
  render: (value, row) => renderAddress(value, row, 'to'),
};

export const from = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.from)}</Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: (value, row) => renderAddress(value, row, 'from'),
};

export const tokenId = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.tokenId)}
    </Translation>
  ),
  dataIndex: 'tokenId',
  key: 'tokenId',
  render: value => (
    <Text span hoverValue={value}>
      <SpanWrap>{value || '-'}</SpanWrap>
    </Text>
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

const FromWrap = styled.div`
  position: relative;
`;

const ImgWrap = styled.img`
  position: absolute;
  right: -0.8571rem;
  top: 0.1429rem;
  ${media.s} {
    right: -1.1429rem;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 100px;
  overflow: hidden;
`;
