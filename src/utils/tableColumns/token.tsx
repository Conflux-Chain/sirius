import React from 'react';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import queryString from 'query-string';
import { ICON_DEFAULT_TOKEN } from 'utils/constants';
import {
  formatBalance,
  formatNumber,
  formatString,
  getENSInfo,
  formatAddress,
  isZeroAddress,
  getNametagInfo,
} from 'utils';
import imgArrow from 'images/token/arrow.svg';
import imgOut from 'images/token/out.svg';
import imgIn from 'images/token/in.svg';
import imgInfo from 'images/info.svg';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { ColumnAge, ContentWrapper } from './utils';
import BigNumber from 'bignumber.js';
import { CFX_TOKEN_TYPES } from '../constants';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { TxnHashRenderComponent } from './transaction';
import { NFTPreview } from 'app/components/NFTPreview/Loadable';
import clsx from 'clsx';
import { Popover } from '@cfxjs/react-ui';
import {
  useBreakpoint,
  media,
} from '@cfxjs/sirius-next-common/dist/utils/media';
import { useTranslation } from 'react-i18next';
import { monospaceFont } from 'styles/variable';
import { ProjectInfo } from 'app/components/ProjectInfo';
import { InfoIconWithTooltip } from '@cfxjs/sirius-next-common/dist/components/InfoIconWithTooltip';
import { Tag } from '@cfxjs/antd';
import { Price } from '@cfxjs/sirius-next-common/dist/components/Price';
import { ValueHighlight } from '@cfxjs/sirius-next-common/dist/components/Highlight';
import { PhishingAddressContainer } from '@cfxjs/sirius-next-common/dist/components/PhishingAddressContainer';

const fromTypeInfo = {
  arrow: {
    src: imgArrow,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  out: {
    src: imgOut,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeOut)}
      </Translation>
    ),
  },
  in: {
    src: imgIn,
    text: (
      <Translation>
        {t => t(translations.general.table.token.fromTypeIn)}
      </Translation>
    ),
  },
};

const reg = /address\/(.*)$/;

type GetFromTypeReturnValueType = 'in' | 'out' | 'arrow';
const getFromType = (value: string): GetFromTypeReturnValueType => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const filter = accountAddress as string;

  return !filter
    ? 'arrow'
    : formatAddress(filter) === formatAddress(value)
    ? 'out'
    : 'in';
};

export const renderAddress = (
  value,
  row,
  type?: 'to' | 'from',
  withArrow = true,
) => {
  let address = '';

  try {
    // fixed for multiple request in /address/:hash page
    let r = reg.exec(window.location.pathname);
    if (r) {
      address = r[1];
    }
  } catch (e) {}

  const { accountAddress = address } = queryString.parse(
    window.location.search,
  );
  const filter = (accountAddress as string) || '';
  let alias = '';

  // dummy address, show name only
  if (row[`${type}ContractInfo`]?.isVirtual) {
    const name = row[`${type}ContractInfo`].name;
    return (
      <ValueHighlight scope="address" value={name}>
        {name}
      </ValueHighlight>
    );
  }

  if (type === 'from') {
    if (row.fromContractInfo && row.fromContractInfo.name)
      alias = row.fromContractInfo.name;
    else if (row.fromTokenInfo && row.fromTokenInfo.name)
      alias = `${row.fromTokenInfo.name}`;
  } else if (type === 'to') {
    if (row.toContractInfo && row.toContractInfo.name)
      alias = row.toContractInfo.name;
    else if (row.toTokenInfo && row.toTokenInfo.name)
      alias = `${row.toTokenInfo.name}`;
    else if (row.contractInfo && row.contractInfo.name)
      alias = row.contractInfo.name;
    else if (row.tokenInfo && row.tokenInfo.name)
      alias = `${row.tokenInfo.name}`;
  }

  let verify = false;

  try {
    // default verify info
    let info = {
      verify: {
        result: 0,
      },
    };
    if (type === 'to') {
      info = row.toContractInfo;
    } else if (type === 'from') {
      info = row.fromContractInfo;
    }
    verify = info.verify.result !== 0;
  } catch (e) {}

  const isEspaceAddress = !!row[`${type}ESpaceInfo`]?.address;

  return (
    <>
      <ValueHighlight scope="address" value={value}>
        <CoreAddressContainer
          value={value}
          alias={alias}
          link={formatAddress(filter) !== formatAddress(value)}
          contractCreated={row.contractCreated}
          verify={verify}
          isEspaceAddress={isEspaceAddress}
          ensInfo={getENSInfo(row)}
          nametagInfo={getNametagInfo(row)}
        />
      </ValueHighlight>
      {type === 'from' && withArrow && (
        <ImgWrap src={fromTypeInfo[getFromType(value)].src} />
      )}
    </>
  );
};

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
                    alias={row?.contractName || null}
                    showIcon={false}
                    ensInfo={getENSInfo(row)}
                    nametagInfo={getNametagInfo(row)}
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
  return (
    <StyledIconWrapper>
      {row?.transferTokenInfo && row?.transferTokenInfo?.address // show -- if transferTokenInfo is empty
        ? [
            <img
              key="img"
              src={row?.transferTokenInfo?.iconUrl || ICON_DEFAULT_TOKEN}
              alt="token icon"
            />,
            row?.transferTokenInfo?.name && row?.transferTokenInfo?.symbol ? (
              <Link
                key="link"
                href={`/token/${row?.transferTokenInfo?.address}`}
              >
                {
                  <Text
                    tag="span"
                    hoverValue={
                      row?.transferTokenInfo?.name
                        ? `${row?.transferTokenInfo?.name} (${row?.transferTokenInfo?.symbol})`
                        : formatAddress(row?.transferTokenInfo?.address)
                    }
                    maxWidth="180px"
                  >
                    {formatString(
                      `${row?.transferTokenInfo?.name} (${row?.transferTokenInfo?.symbol})`,
                      36,
                    )}
                  </Text>
                }
              </Link>
            ) : (
              <StyledToken2NotAvailableWrapper>
                <CoreAddressContainer
                  value={row?.transferTokenInfo?.address}
                  alias={t(translations.general.notAvailable)}
                  showIcon={false}
                  ensInfo={getENSInfo(row)}
                  nametagInfo={getNametagInfo(row)}
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
    let verify = false;
    if (row.contractInfo) {
      verify = row.contractInfo.verify.result !== 0;
    } else if (row.verified === true) {
      verify = true;
    }
    return (
      <CoreAddressContainer
        value={value}
        isFull={isFull}
        verify={verify}
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
  render: (value, row, index, opt?) => {
    const decimals = opt
      ? opt.decimals
      : row.transferTokenInfo?.decimals || row.transferTokenInfo?.decimal || 0;
    return value ? (
      <Text
        tag="span"
        maxCount={23}
        mobileMaxCount={19}
        hoverValue={formatBalance(value, decimals, true)}
      >
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
  render: (value, row) => {
    return (
      <PhishingAddressContainer
        phishingData={row.toPhishingData}
        address={value}
      >
        <FromWrap>{renderAddress(value, row, 'to', false)}</FromWrap>
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
  render: (value, row, _, withArrow = true) => {
    return (
      <PhishingAddressContainer
        phishingData={row.fromPhishingData}
        address={value}
      >
        <FromWrap>{renderAddress(value, row, 'from', withArrow)}</FromWrap>
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

export const account = {
  width: 1,
  title: (
    <Translation>
      {t => t(translations.general.table.token.accountAddress)}
    </Translation>
  ),
  dataIndex: 'account',
  key: 'account',
  render: (value, row) => (
    <AccountWrapper>
      <CoreAddressContainer
        value={value.address}
        alias={
          value.name ||
          (row.tokenInfo && row.tokenInfo.name ? row.tokenInfo.name : null)
        }
        isFull={true}
        ensInfo={getENSInfo(row)}
        nametagInfo={getNametagInfo(row)}
      />
    </AccountWrapper>
  ),
};

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
    return (
      <ContentWrapper right>
        <Text tag="span" hoverValue={`${percentage}%`}>
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

export const tokenId = (contractAddress?: string) => ({
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
          <NFTPreview
            contractAddress={contractAddress || row?.transferTokenInfo?.address}
            tokenId={value}
          />
        )}
      </>
    );
  },
});

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
      <Link href={`/nft/${row.transferTokenInfo?.address}/${value}`}>
        <Tag color="default">
          <Translation>
            {t => t(translations.general.table.token.view)}
          </Translation>
        </Tag>
      </Link>
    );
  },
};

const TraceTypeElement = ({ info }) => {
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();

  const outcome = info?.result?.outcome;

  const level = (
    <span className="level">
      <span className="vertical"></span>
      {info.index
        .replace(/\d+/g, '')
        .split('')
        .map((_, i) => (
          <span className="horizontal" key={i}></span>
        ))}
    </span>
  );

  return (
    <StyledTractTypeWrapper className={clsx(outcome)}>
      {level}
      {outcome && outcome !== 'success' ? (
        <Popover
          notSeperateTitle
          title={t(translations.general.table.token.traceStatusTitle)}
          content={t(translations.general.table.token.traceStatus[outcome])}
          placement="top"
          hoverable={true}
          trigger={breakpoint === 's' ? 'click' : 'hover'}
          contentClassName={clsx('siriuse-status-popover')}
        >
          <span className="dot"></span>
        </Popover>
      ) : null}
      <Text hoverValue={`${info.type}${info.index}`}>
        <div className="type-container">
          {info.type}
          {info.index}
        </div>
      </Text>
    </StyledTractTypeWrapper>
  );
};

export const traceType = {
  width: 1,
  title: (
    <Translation>
      {t => (
        <span style={{ marginLeft: '1rem' }}>
          {t(translations.general.table.token.traceType)}
        </span>
      )}
    </Translation>
  ),
  dataIndex: 'type',
  key: 'type',
  render: (_, row) => <TraceTypeElement info={row} />,
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
  render: (value, row) => (
    <AccountWrapper>
      <CoreAddressContainer
        value={value}
        alias={
          value.name ||
          (row.ownerTokenInfo && row.ownerTokenInfo.name
            ? row.ownerTokenInfo.name
            : null)
        }
        isFull={true}
        ensInfo={getENSInfo(row)}
        nametagInfo={getNametagInfo(row)}
      />
    </AccountWrapper>
  ),
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
  img {
    margin-bottom: 6px;
    margin-right: 2px;
  }
`;
const StyledTractTypeWrapper = styled.span`
  padding-left: 0.2rem;

  .type-container {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 8.5714rem;
    display: inline-block;
    vertical-align: middle;
  }

  .level {
    .vertical {
      width: 0.0714rem;
      height: 0.4286rem;
      border-left: 1px solid !important;
      display: inline-block;
      margin-bottom: 0.1429rem;
      color: #94a3b6;
    }

    .horizontal {
      width: 0.4286rem;
      height: 0.1429rem;
      border-top: 1px solid !important;
      display: inline-block;
      margin-right: 0.2143rem;
      margin-bottom: 0.0714rem;
      color: #94a3b6;
    }
  }

  .dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    top: 0.5rem;
    left: -0.1429rem;
    display: inline-block;
    margin-right: 0.2143rem;
    cursor: pointer;
  }

  &.success {
    .dot {
      background-color: #7cd77b;
      pointer-events: none;
    }
  }

  &.fail {
    .dot {
      background-color: #e64e4e;
    }
  }

  &.revert {
    .dot {
      background-color: #e467b3;
    }
  }

  .tooltip-content.siriuse-status-popover {
    padding: 0.2857rem 0.8571rem;

    .item.title {
      padding: 0;

      .icon {
        width: 0.8571rem;
        height: 0.8571rem;
      }

      .text {
        margin-left: 0.2857rem;
        color: #333333;
        text-shadow: 0rem 0.4286rem 1.1429rem rgba(0, 0, 0, 0.08);
      }
    }

    .items {
      color: #a4a8b6;
      text-shadow: 0rem 0.4286rem 1.1429rem rgba(0, 0, 0, 0.08);
      max-width: 14.2857rem;
      line-height: 1.0714rem;
      white-space: break-spaces;
      padding-bottom: 0.1429rem;
      background-color: transparent;
      overflow: hidden !important;
    }

    .inner {
      min-width: inherit;
    }
  }
`;
