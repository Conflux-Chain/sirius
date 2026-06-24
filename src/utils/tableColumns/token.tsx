import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import {
  formatBalance,
  formatNumber,
  formatString,
  formatAddress,
  isZeroAddress,
} from 'utils';
import imgInfo from 'images/info.svg';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { getAddressNameInfo } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/utils';
import {
  ColumnAge,
  ContentWrapper,
  fromTypeInfo,
  getFromType,
  renderAddress,
} from './utils';
import BigNumber from 'bignumber.js';
import { CFX_TOKEN_TYPES } from '../constants';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { TxnHashRenderComponent } from './transaction';
import { NFTPreview } from 'app/components/NFTPreview/Loadable';
import { useTranslation } from 'react-i18next';
import { monospaceFont } from 'styles/variable';
import { ProjectInfo } from 'app/components/ProjectInfo';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { Tag } from '@cfxjs/antd';
import { Price } from '@cfxjs/sirius-next-common/dist/components/Price';
import { PhishingAddressContainer } from '@cfxjs/sirius-next-common/dist/components/PhishingAddressContainer';

export const token = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.token)}</Translation>
  ),
  key: 'blockIndex',
  render: row => {
    return (
      <StyledIconWrapper>
        <img src={row?.iconUrl || ICON_DEFAULT_TOKEN} alt="token icon" />
        <Link href={`/token/${formatAddress(row.address)}`}>
          <Translation>
            {t => (
              <Text
                tag="span"
                hoverValue={
                  row.name || row.symbol
                    ? `${row?.name || t(translations.general.notAvailable)} (${
                        row?.symbol || t(translations.general.notAvailable)
                      })`
                    : formatAddress(row.address)
                }
              >
                {row.name || row.symbol ? (
                  formatString(
                    `${row?.name || t(translations.general.notAvailable)} (${
                      row?.symbol || t(translations.general.notAvailable)
                    })`,
                    row?.length || 32,
                  )
                ) : (
                  <CoreAddressContainer
                    value={row?.address}
                    nameMap={row?.nameMap}
                    tokenName={row?.tokenName}
                    contractName={row?.contractName}
                    verificationName={row?.verificationName}
                    showIcon={false}
                    ensName={row?.ensName}
                    nametag={row?.nametag}
                  />
                )}
              </Text>
            )}
          </Translation>
        </Link>
      </StyledIconWrapper>
    );
  },
};

export const Token2 = ({ row }) => {
  const { t } = useTranslation();
  const address = row?.address;
  const { tokenIconUrl, tokenName, tokenSymbol, nametag, ensName, verify } =
    getAddressNameInfo(address, row.nameMap) || {};
  return (
    <StyledIconWrapper>
      {address
        ? [
            <img
              key="img"
              src={tokenIconUrl || ICON_DEFAULT_TOKEN}
              alt="token icon"
            />,
            tokenName && tokenSymbol ? (
              <Link key="link" href={`/token/${address}`}>
                {
                  <Text
                    tag="span"
                    hoverValue={
                      tokenName
                        ? `${tokenName} (${tokenSymbol})`
                        : formatAddress(address)
                    }
                    maxWidth="180px"
                  >
                    {formatString(`${tokenName} (${tokenSymbol})`, 36)}
                  </Text>
                }
              </Link>
            ) : (
              <StyledToken2NotAvailableWrapper>
                <CoreAddressContainer
                  value={address}
                  tokenName={t(translations.general.notAvailable)}
                  showIcon={false}
                  ensName={ensName}
                  nametag={nametag}
                  verify={verify}
                />
                &nbsp;
                <InfoIconWithTooltip
                  info={t(translations.general.abnormalToken)}
                />
              </StyledToken2NotAvailableWrapper>
            ),
          ]
        : '--'}
    </StyledIconWrapper>
  );
};
const StyledToken2NotAvailableWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const token2 = {
  ...token,
  render: row => <Token2 row={row} />,
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
    const count = <Price>{value}</Price>;

    return (
      <ContentWrapper right monospace>
        {row.quoteUrl ? (
          <LinkA href={row.quoteUrl} target="_blank">
            {count}
          </LinkA>
        ) : (
          count
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
          title={
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
  render: value => {
    return (
      <ContentWrapper right monospace>
        <Price>{value}</Price>
      </ContentWrapper>
    );
  },
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
  render: (value, row) => (
    <ContentWrapper right monospace>
      <Link href={`/token/${formatAddress(row.address)}?tab=holders`}>
        {Number.isInteger(value) && Number(value) > 0
          ? formatNumber(value, {
              keepDecimal: false,
              withUnit: false,
            })
          : '-'}
      </Link>
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
  render: (value, row) => {
    return (
      <CoreAddressContainer
        value={value}
        isFull={isFull}
        verify={row.verified}
        showAddressLabel={false}
        showENSLabel={false}
      />
    );
  },
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
  render: (value, row) => {
    const { tokenDecimals } =
      getAddressNameInfo(row?.address, row.nameMap) || {};
    const decimals = tokenDecimals || 0;
    return value ? (
      <Text
        tag="span"
        maxCount={23}
        mobileMaxCount={19}
        hoverValue={formatBalance(value, decimals, true)}
      >
        {formatBalance(value, decimals, false, {}, '0.001')}
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
  render: (
    value,
    row,
    _,
    { withProxy = false, showVerificationName = false } = {},
  ) => {
    return (
      <PhishingAddressContainer
        phishingData={row.toPhishingData}
        address={value}
      >
        <FromWrap>
          {renderAddress(value, row, 'to', {
            withProxy,
            showVerificationName,
          })}
        </FromWrap>
      </PhishingAddressContainer>
    );
  },
};

export const from = {
  width: 1,
  title: (
    <Translation>{t => t(translations.general.table.token.from)}</Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: (
    value,
    row,
    _,
    { withArrow = true, showVerificationName = false } = {},
  ) => {
    return (
      <PhishingAddressContainer
        phishingData={row.fromPhishingData}
        address={value}
      >
        <FromWrap>
          {renderAddress(value, row, 'from', {
            withArrow,
            showVerificationName,
          })}
        </FromWrap>
      </PhishingAddressContainer>
    );
  },
};

export const fromType = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.fromType)}
    </Translation>
  ),
  dataIndex: 'from',
  key: 'from',
  render: value => fromTypeInfo[getFromType(value)].text,
};

export const account = (token: string) => ({
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.accountAddress)}
    </Translation>
  ),
  dataIndex: 'account',
  key: 'account',
  render: (value, row) => {
    return (
      <AccountWrapper>
        <Link
          href={`/token/${formatAddress(token)}?a=${value.address}`}
          className="link-wrapper"
        >
          <CoreAddressContainer
            nameMap={row.nameMap}
            value={value.address}
            isFull={true}
            link={false}
          />
        </Link>
      </AccountWrapper>
    );
  },
});

export const balance = (decimal, price, transferType) => ({
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.quantity)}
      </Translation>
      {transferType === CFX_TOKEN_TYPES.erc1155 ? (
        <ThTipWrap>
          <Text
            tag="span"
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
  sortable: true,
  render: value => {
    const decimals = decimal || 0;
    // Decimal places are determined according to the price
    const decimalPlace = +price > 1 ? (+price).toFixed(0).length + 1 : 2;
    const tinyBalanceThreshold = `0.${Array(decimalPlace).join('0')}1`;
    const textProps = {
      tag: 'span',
      hoverValue: formatBalance(value, decimals, true),
      maxCount: 43,
      mobileMaxCount: 35,
    } as const;
    return (
      <ContentWrapper right>
        {value != null ? (
          transferType === CFX_TOKEN_TYPES.erc20 ? (
            +(
              formatBalance(value, decimals, false, {
                precision: decimals,
                withUnit: false,
                keepDecimals: true,
              }) || 0
            ) < +tinyBalanceThreshold ? (
              <Text {...textProps}>{`< ${tinyBalanceThreshold}`}</Text>
            ) : (
              <Text {...textProps}>
                {formatBalance(value, decimals, false, {
                  precision: decimalPlace,
                  keepZero: true,
                  withUnit: false,
                })}
              </Text>
            )
          ) : (
            <Text {...textProps}>
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
    const percentageWithPrecision3 =
      percentage === null
        ? '-'
        : percentage < 0.001
        ? '< 0.001%'
        : formatNumber(percentage, {
            precision: 3,
            withUnit: false,
            keepZero: true,
          }) + '%';
    const percentageWithPrecision8 =
      percentage === null
        ? '-'
        : percentage < 0.00000001
        ? '< 0.00000001%'
        : formatNumber(percentage, {
            precision: 8,
            withUnit: false,
            keepZero: true,
          }) + '%';
    return (
      <ContentWrapper right>
        <Text tag="span" hoverValue={percentageWithPrecision8}>
          {percentageWithPrecision3}
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
  render: (value, row) => {
    return (
      <>
        <Text tag="span" hoverValue={value}>
          <SpanWrap>{value || '-'}</SpanWrap>
        </Text>
        {!isZeroAddress(formatAddress(row.to)) && (
          <NFTPreview contractAddress={row?.address} tokenId={value} />
        )}
      </>
    );
  },
};

export const details = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.details)}
    </Translation>
  ),
  dataIndex: 'tokenId',
  key: 'tokenId',
  render: (value, row) => {
    return (
      <Link href={`/nft/${row.address}/${value}`}>
        <Tag color="default">
          <Translation>
            {t => t(translations.general.table.token.view)}
          </Translation>
        </Tag>
      </Link>
    );
  },
};

export const traceOutcome = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.traceOutcome)}
    </Translation>
  ),
  dataIndex: 'result',
  key: 'outcome',
  render: (_, row) => {
    return row.result?.outcome || '--';
  },
};

export const traceResult = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.traceResult)}
    </Translation>
  ),
  dataIndex: 'result',
  key: 'result',
  render(_, row) {
    const returnData = row.result?.returnData;
    const outcome = row.result?.outcome;
    const decodedMessage = row.result?.decodedMessage;

    const text = !returnData || returnData === '0x' ? '--' : returnData;
    let body: React.ReactNode = null;

    if (outcome === 'success') {
      if (!returnData || returnData === '0x') {
        body = '--';
      } else {
        const hoverValue = (
          <span
            style={{
              maxWidth: '34.2857rem',
              maxHeight: '5.7143rem',
              whiteSpace: 'break-spaces',
              display: 'block',
              overflow: 'auto',
            }}
          >
            {text}
          </span>
        );
        body = (
          <Text tag="span" hoverValue={hoverValue} maxWidth="17.1429rem">
            {returnData}
          </Text>
        );
      }
    } else if (['fail', 'revert'].includes(outcome)) {
      body = decodedMessage;
    } else {
      body = '--';
    }

    return body;
  },
};

export const projectInfo = {
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.projectInfo.projectInfo)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'securityCredits',
  key: 'securityCredits',
  render: (value, row) => {
    const { securityAudit, name } = row;
    return (
      <ContentWrapper monospace>
        <ProjectInfo securityAudit={securityAudit} tokenName={name} />
      </ContentWrapper>
    );
  },
};

export const NFTOwner = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.accountAddress)}
    </Translation>
  ),
  dataIndex: 'owner',
  key: 'owner',
  render: (value, row) => {
    return (
      <AccountWrapper>
        <CoreAddressContainer
          value={value}
          nameMap={row.nameMap}
          isFull={true}
        />
      </AccountWrapper>
    );
  },
};

export const NFTQuantity = {
  width: 1,
  title: (
    <ContentWrapper right>
      <Translation>
        {t => t(translations.general.table.token.quantity)}
      </Translation>
    </ContentWrapper>
  ),
  dataIndex: 'amount',
  key: 'amount',
  render: value => <ContentWrapper right>{value}</ContentWrapper>,
};

export const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  font-family: ${monospaceFont};

  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.4rem;
  }
`;

const FromWrap = styled.div`
  position: relative;
`;

const SpanWrap = styled.span`
  display: inline-block;
  text-overflow: ellipsis;
  max-width: 120px;
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

export const AccountWrapper = styled.div`
  .link-wrapper .sirius-text > div {
    cursor: pointer;
  }
`;
