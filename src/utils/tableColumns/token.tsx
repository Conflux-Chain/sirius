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
import { CountDown } from '../../app/components/CountDown/Loadable';
import {
  formatString,
  formatNumber,
  getPercent,
  fromDripToCfx,
  fromDripToGdrip,
} from '../../utils/';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

const renderText = (value, hoverValue?) => (
  <Text span hoverValue={hoverValue || value}>
    {value}
  </Text>
);

const renderFilterableAddress = (value, row, index, type?: string) => {
  const { accountAddress, transactionHash } = queryString.parse(
    window.location.search,
  );
  const filter =
    (accountAddress as string) || (transactionHash as string) || '';

  return (
    <FromWrap>
      {filter === value
        ? renderText(formatString(value, 'address'), value)
        : renderText(
            <LinkWidthFilter
              href={value}
              children={formatString(value, 'address')}
            />,
            value,
          )}
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

const LinkWidthFilter = ({ href, children }) => {
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
      {children}
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
  render: formatNumber,
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
  render: value => renderText(formatString(formatNumber(value)), value),
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
  render: formatNumber,
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
    <Link href={`/address/${value}`}>
      {renderText(formatString(value, 'address'))}
    </Link>
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
    <Link href={`/transactions/${value}`}>
      {renderText(formatString(value, 'hash'))}
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
  render: fromDripToGdrip,
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
