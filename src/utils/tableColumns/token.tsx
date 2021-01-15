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
import { defaultTokenIcon } from '../../constants';
import {
  formatString,
  formatNumber,
  isAddress,
  isHash,
  formatBalance,
} from '../../utils';
import imgArrow from 'images/token/arrow.svg';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';

interface Query {
  accountAddress?: string;
  transactionHash?: string;
}

const getContractName = (value, row, type) => {
  if (type === 'from' && row.fromContractInfo && row.fromContractInfo.name)
    return formatString(row.fromContractInfo.name, 'tag');
  else if (type === 'to' && row.toContractInfo && row.toContractInfo.name)
    return formatString(row.toContractInfo.name, 'tag');
  else if (type === 'to' && row.contractInfo && row.contractInfo.name)
    return formatString(row.contractInfo.name, 'tag');
  else return formatString(value, 'address');
};

const renderFilterableAddress = (
  value,
  row,
  index,
  pOpt?: {
    type?: 'to' | 'from';
    isToken?: boolean;
    needFilter?: boolean;
  },
) => {
  const opt = {
    type: 'to',
    isToken: true,
    needFilter: false,
    ...pOpt,
  };
  const { accountAddress } = queryString.parse(window.location.search);
  const filter = (accountAddress as string) || '';

  const renderTo = () => {
    if (filter === value && opt.needFilter) {
      return (
        <Text span hoverValue={value}>
          {getContractName(value, row, opt.type)}
        </Text>
      );
    } else if (value) {
      if (opt.needFilter) {
        return (
          <LinkWithFilter href={value}>
            <Text span hoverValue={value}>
              {getContractName(value, row, opt.type)}
            </Text>
          </LinkWithFilter>
        );
      } else {
        return (
          <Link href={`/address/${value}`}>
            <Text span hoverValue={value}>
              {getContractName(value, row, opt.type)}
            </Text>
          </Link>
        );
      }
    } else {
      if (row.contractCreated) {
        if (row.contractCreated === filter && opt.needFilter) {
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
        <ImgWrap src={!filter ? imgArrow : filter === value ? imgOut : imgIn} />
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
      <img src={row?.icon || defaultTokenIcon} alt="token icon" />
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
