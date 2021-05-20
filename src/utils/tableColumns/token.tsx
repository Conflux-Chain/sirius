import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from '../../locales/i18n';
import styled from 'styled-components/macro';
import { Link } from '../../app/components/Link/Loadable';
import { Text } from '../../app/components/Text/Loadable';
import queryString from 'query-string';
import { media } from '../../styles/media';
import { defaultTokenIcon } from '../../constants';
import { formatBalance, formatNumber, formatString } from '../../utils';
import imgArrow from 'images/token/arrow.svg';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';
import imgInfo from 'images/info.svg';
import { AddressContainer } from '../../app/components/AddressContainer';
import { formatAddress } from '../cfx';
import { ColumnAge, ContentWrapper } from './utils';
import BigNumber from 'bignumber.js';
import { cfxTokenTypes, InternalContracts } from '../constants';
import { Tooltip } from '../../app/components/Tooltip/Loadable';
import { TxnHashRenderComponent } from './transaction';
import { CURRENCY_SYMBOL } from 'utils/constants';

export const renderAddress = (
  value,
  row,
  type?: 'to' | 'from',
  withArrow = true,
) => {
  const { accountAddress } = queryString.parse(window.location.search);
  const filter = (accountAddress as string) || '';
  let alias = '';
  if (type === 'from') {
    if (InternalContracts[value]) alias = InternalContracts[value];
    else if (row.fromContractInfo && row.fromContractInfo.name)
      alias = row.fromContractInfo.name;
    else if (row.fromTokenInfo && row.fromTokenInfo.name)
      alias = `${row.fromTokenInfo.name} (${row.fromTokenInfo.symbol || '-'})`;
  } else if (type === 'to') {
    if (InternalContracts[value]) alias = InternalContracts[value];
    else if (row.toContractInfo && row.toContractInfo.name)
      alias = row.toContractInfo.name;
    else if (row.toTokenInfo && row.toTokenInfo.name)
      alias = `${row.toTokenInfo.name} (${row.toTokenInfo.symbol || '-'})`;
    else if (row.contractInfo && row.contractInfo.name)
      alias = row.contractInfo.name;
    else if (row.tokenInfo && row.tokenInfo.name)
      alias = `${row.tokenInfo.name} (${row.tokenInfo.symbol || '-'})`;
  }

  return (
    <>
      <AddressContainer
        value={value}
        alias={alias}
        isLink={formatAddress(filter) !== formatAddress(value)}
        contractCreated={row.contractCreated}
      />
      {type === 'from' && withArrow && (
        <ImgWrap
          src={
            !filter
              ? imgArrow
              : formatAddress(filter) === formatAddress(value)
              ? imgOut
              : imgIn
          }
        />
      )}
    </>
  );
};

export const number = (page, pageSize) => ({
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.number)}</Translation>
  ),
  dataIndex: 'epochNumber',
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
        <Link href={`/token/${formatAddress(row.address)}`}>
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
                  32,
                )}
              </Text>
            )}
          </Translation>
        </Link>
      </StyledIconWrapper>
    );
  },
};

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .tooltip,
  .tooltip-wrapper,
  > span:first-child {
    display: inline-flex !important;
  }

  .tooltip {
    margin-right: 5px;
  }

  img {
    display: block;
    width: 14px;
    height: 14px;
  }
`;

export const price = {
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.price)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'price',
  key: 'price',
  sortable: true,
  render: (value, row) => {
    const count = `${CURRENCY_SYMBOL}${formatNumber(value || 0, {
      withUnit: false,
      precision: 2,
      keepZero: true,
    })}`;
    return (
      <ContentWrapper right monospace>
        {value != null ? (
          row.quoteUrl ? (
            <LinkA href={row.quoteUrl} target="_blank">
              {count}
            </LinkA>
          ) : (
            count
          )
        ) : (
          '-'
        )}
      </ContentWrapper>
    );
  },
};

export const marketCap = {
  width: 1,
  title: (
    <ContentWrapper right>
      <IconWrapper>
        <Tooltip
          hoverable
          text={
            <Translation>
              {t => (
                <div
                  dangerouslySetInnerHTML={{
                    __html: t(translations.tokens.dataSource),
                  }}
                />
              )}
            </Translation>
          }
          placement="top"
        >
          <img src={imgInfo} alt="?" />
        </Tooltip>
        <span>
          <Translation>
            {t => t(translations.general.table.token.marketCap)}
          </Translation>
        </span>
      </IconWrapper>
    </ContentWrapper>
  ),
  dataIndex: 'totalPrice',
  key: 'totalPrice',
  sortable: true,
  render: value => (
    <ContentWrapper right monospace>
      {value != null && value > 0
        ? `${CURRENCY_SYMBOL}${formatNumber(value || 0, {
            keepDecimal: false,
            withUnit: false,
          })}`
        : '-'}
    </ContentWrapper>
  ),
};
export const transfer = {
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.transfer)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: `transferCount`,
  key: `transferCount`,
  sortable: true,
  render: value => (
    <ContentWrapper right monospace>
      {formatNumber(value, {
        keepDecimal: false,
        withUnit: false,
      })}
    </ContentWrapper>
  ),
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
  sortable: true,
  render: (value, row) => formatBalance(value, row.decimals),
};

export const holders = {
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.holders)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'holderCount',
  key: 'holderCount',
  sortable: true,
  render: value => (
    <ContentWrapper right monospace>
      {Number.isInteger(value)
        ? formatNumber(value, {
            keepDecimal: false,
            withUnit: false,
          })
        : '-'}
    </ContentWrapper>
  ),
};

export const contract = (isFull = false) => ({
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.contract)}
    </Translation>
  ),
  dataIndex: 'address',
  key: 'address',
  render: value => <AddressContainer value={value} isFull={isFull} />,
});

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
  render: value => <TxnHashRenderComponent hash={value} />,
};

export const age = (ageFormat, toggleAgeFormat) =>
  ColumnAge({ ageFormat, toggleAgeFormat });

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
  render: (value, row) => (
    <FromWrap>{renderAddress(value, row, 'to')}</FromWrap>
  ),
};

export const from = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.from)}</Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: (value, row) => (
    <FromWrap>{renderAddress(value, row, 'from')}</FromWrap>
  ),
};

export const account = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.accountAddress)}
    </Translation>
  ),
  dataIndex: 'account',
  key: 'account',
  render: value => (
    <AddressContainer value={value.address} alias={value.name} isFull={true} />
  ),
};

export const balance = (decimal, price, transferType) => ({
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.quantity)}
      </Translation>
      {transferType === cfxTokenTypes.erc1155 ? (
        <ThTipWrap>
          <Text
            span
            hoverValue={
              <Translation>
                {t => t(translations.general.table.token.erc1155QuantityTip)}
              </Translation>
            }
          >
            <img src={imgInfo} alt="?" />
          </Text>
        </ThTipWrap>
      ) : null}
    </ContentWrapper>
  ),
  dataIndex: 'balance',
  key: 'balance',
  render: value => {
    const decimals = decimal || 0;
    // Decimal places are determined according to the price
    const decimalPlace = price > 1 ? price.toFixed(0).length + 1 : 2;
    const tinyBalanceThreshold = `0.${Array(decimalPlace).join('0')}1`;
    return (
      <ContentWrapper right>
        {value != null ? (
          transferType === cfxTokenTypes.erc20 ? (
            +(
              formatBalance(value, decimals, false, {
                precision: decimals,
                withUnit: false,
                keepDecimals: true,
              }) || 0
            ) < +tinyBalanceThreshold ? (
              <Text span hoverValue={formatBalance(value, decimals, true)}>
                {`< ${tinyBalanceThreshold}`}
              </Text>
            ) : (
              <Text span hoverValue={formatBalance(value, decimals, true)}>
                {formatBalance(value, decimals, false, {
                  precision: decimalPlace,
                  keepZero: true,
                  withUnit: false,
                })}
              </Text>
            )
          ) : (
            <Text span hoverValue={formatBalance(value, decimals, true)}>
              {formatBalance(value, decimals, false, {
                withUnit: false,
              })}
            </Text>
          )
        ) : (
          '--'
        )}
      </ContentWrapper>
    );
  },
});

export const percentage = total => ({
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.percentage)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'proportion',
  key: 'proportion',
  render: (value, row) => {
    const percentage =
      value != null
        ? value
        : total > 0
        ? new BigNumber(row.balance)
            .dividedBy(new BigNumber(total))
            .multipliedBy(100)
            .toFixed(8)
        : null;
    return (
      <ContentWrapper right>
        <Text span hoverValue={`${percentage}%`}>
          {percentage === null
            ? '-'
            : percentage < 0.001
            ? '< 0.001%'
            : formatNumber(percentage, {
                precision: 3,
                withUnit: false,
                keepZero: true,
              }) + '%'}
        </Text>
      </ContentWrapper>
    );
  },
});

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

export const traceType = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.traceType)}
    </Translation>
  ),
  dataIndex: 'type',
  key: 'type',
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
  width: 36px;
  height: 20px;
  right: -0.8571rem;
  top: 0.1429rem;
  ${media.s} {
    right: -0.98rem;
  }
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 150px;
  overflow: hidden;
  vertical-align: bottom;
`;

const ThTipWrap = styled.span`
  display: inline-block;
  white-space: normal;
  margin-left: 5px;

  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-bottom: 0.2857rem;
  }
`;

export const LinkA = styled.a`
  color: #1e3de4 !important;
  &:hover {
    color: #0f23bd !important;
  }
`;
