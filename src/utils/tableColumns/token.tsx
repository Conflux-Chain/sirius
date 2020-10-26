import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router-dom';
import { media } from '../../styles/media';
import { CountDown } from '../../app/components/CountDown/Loadable';
import {
  formatString,
  formatNumber,
  isAddress,
  isHash,
  formatBalance,
} from '../../utils';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

const renderFilterableAddress = (
  value,
  row,
  index,
  pOpt?: {
    type?: 'to' | 'from';
    isToken?: boolean;
    nameTag?: string;
  },
) => {
  const opt = {
    type: 'to',
    isToken: true,
    ...pOpt,
  };
  const { accountAddress } = queryString.parse(window.location.search);
  const filter = (accountAddress as string) || '';

  const renderTo = () => {
    if (filter === value) {
      if (opt.nameTag) {
        return (
          <Text span hoverValue={value}>
            {opt.nameTag}
          </Text>
        );
      } else {
        return (
          <Text span hoverValue={value}>
            {formatString(value, 'address')}
          </Text>
        );
      }
    } else if (value) {
      if (opt.isToken) {
        return (
          <LinkWithFilter href={value}>
            <Text span hoverValue={value}>
              {formatString(value, 'address')}
            </Text>
          </LinkWithFilter>
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
    } else {
      if (row.contractCreated) {
        if (row.contractCreated === filter) {
          return (
            <Text span hoverValue={row.contractCreated}>
              <Translation>
                {t => t(translations.transaction.contractCreation)}
              </Translation>
            </Text>
          );
        }
        return (
          <Link href={`/address/${row.contractCreated}`}>
            <Text span hoverValue={row.contractCreated}>
              <Translation>
                {t => t(translations.transaction.contractCreation)}
              </Translation>
            </Text>
          </Link>
        );
      } else {
        return (
          <Translation>
            {t => t(translations.transaction.contractCreation)}
          </Translation>
        );
      }
    }
  };
  return (
    <FromWrap>
      {renderTo()}
      {opt.type === 'from' && (
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

const LinkWithFilter = ({ href, children }) => {
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
      {row?.icon && <img src={row.icon} alt="token icon" />}
      <Link href={`/token/${row.address}`}>
        <Text span hoverValue={`${row?.name} (${row?.symbol})`}>
          {formatString(`${row?.name} (${row?.symbol})`, 28)}
        </Text>
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
  render: value => (
    <Text span hoverValue={value}>
      {formatNumber(value)}
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
  dataIndex: 'accountTotal',
  key: 'accountTotal',
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
  render: value => (
    <Link href={`/address/${value}`}>
      <Text span hoverValue={value}>
        {formatString(value, 'address')}
      </Text>
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
      : row.token?.decimals || row.token?.decimal || 18;
    return value ? (
      <Text span hoverValue={formatBalance(value, decimals, true)}>
        {`${formatBalance(value, decimals)}`}
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
  render: (value, row, index, opt?) =>
    renderFilterableAddress(value, row, index, {
      type: 'to',
      ...opt,
    }),
};

export const from = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.from)}</Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: (value, row, index, opt?) =>
    renderFilterableAddress(value, row, index, {
      type: 'from',
      ...opt,
    }),
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
