import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import numeral from 'numeral';
import { isAddress, isHash } from '../util';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { media } from '../../styles/media';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

const renderTextEllipsis = (value, hoverValue?) => {
  return (
    <Text span maxWidth="5.7143rem" hoverValue={hoverValue || value}>
      {value}
    </Text>
  );
};

const renderFilterableAddress = (value, row, index, type: string) => {
  const { accountAddress, transactionHash } = queryString.parse(
    window.location.search,
  );
  const filter =
    (accountAddress as string) || (transactionHash as string) || '';

  return (
    <FromWrap>
      {filter === value
        ? renderTextEllipsis(value)
        : renderTextEllipsis(<LinkWidthFilter href={value} />, value)}
      {type === 'from' && (
        <ImgWrap
          src={
            !filter
              ? '/token/arrow.svg'
              : filter === value
              ? '/token/out.svg'
              : '/token/in.svg'
          }
        />
      )}
    </FromWrap>
  );
};

const LinkWidthFilter = ({ href }) => {
  const history = useHistory();
  const location = useLocation();

  const onFilter = (filter: string) => {
    let object: Query = {};
    if (isAddress(filter)) {
      object.accountAddress = filter;
    } else if (isHash(filter)) {
      object.transactionHash = filter;
    }
    let { pageSize: parsedPageSize, ...others } = queryString.parse(
      location.search,
    );
    if (!parsedPageSize) {
      parsedPageSize = '10';
    }
    const urlWithQuery = queryString.stringifyUrl({
      url: location.pathname,
      query: {
        ...others,
        page: '1',
        pageSize: parsedPageSize as string,
        ...object,
      },
    });
    history.push(urlWithQuery);
  };

  return (
    <Link
      onClick={e => {
        e.preventDefault();
        onFilter(href);
      }}
    >
      {href}
    </Link>
  );
};

export const number = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  key: 'epochNumber',
  render: (value, row, index) => {
    return index + 1;
  },
};

export const token = {
  width: 1,
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
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.transfer)}
    </Translation>
  ),
  dataIndex: 'transferCount',
  key: 'transferCount',
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
  render: value => renderTextEllipsis(numeral(value).format('0,0')),
};

export const holders = {
  width: 1,
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
  width: 1,
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
    <Link href={`/transactions/${value}`}>{renderTextEllipsis(value)}</Link>
  ),
};

export const age = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.age)}</Translation>
  ),
  dataIndex: 'syncTimestamp',
  key: 'age',
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
  render: value => renderTextEllipsis(numeral(value).format(0, 0)), // todo, big number will transfer to NaN
};

export const to = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.to)}</Translation>
  ),
  dataIndex: 'to',
  key: 'to',
  render: renderFilterableAddress,
};

export const from = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.from)}</Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: (value, row, index) =>
    renderFilterableAddress(value, row, index, 'from'),
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
