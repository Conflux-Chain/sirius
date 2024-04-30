/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from 'app/components/List/Loadable';
import { Text } from 'app/components/Text/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { formatBalance, toThousands } from 'utils';
import { CFX_TOKEN_TYPES } from 'utils/constants';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { LinkA } from 'utils/tableColumns/token';
import CRC20bg from 'images/token/crc20bg.png';
import CRC721bg from 'images/token/crc721bg.png';
import CRC1155bg from 'images/token/crc1155bg.png';
import DownIcon from 'images/token/down.svg';
import UpIcon from 'images/token/up.svg';
import FlatIcon from 'images/token/flat.svg';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils';
import { Tag } from '@cfxjs/antd';
import { ProjectInfo } from '../../components/ProjectInfo';
import { Price } from 'app/components/Price/Loadable';

interface SecurityAudit {
  audit: {
    result: number;
    auditUrl: string;
  };
  cex: {
    binance: string;
    huobi: string;
    okex: string;
  };
  dex: {
    moonswap: string;
  };
  sponsor: number;
  track: {
    coinMarketCap: string;
  };
  verify: number;
  zeroAdmin: number;
}

export interface BasicProps {
  address?: string;
  transferType?: string;
  totalSupply?: string;
  price?: number;
  totalPrice?: number;
  quoteUrl?: string;
  symbol?: string;
  name?: string;
  tokenAddress?: string;
  holderCount?: number;
  holderIncreasePercent?: number;
  decimals?: number;
  transferCount?: number;
  securityAudit?: SecurityAudit;
  website?: string;
}

export const tokenTypeTag = (t, transferType: any) => {
  switch (transferType) {
    case CFX_TOKEN_TYPES.erc1155:
      return (
        <TokenTypeTagWrapper className={transferType}>
          <span>
            {t(translations.header.tokens1155).replace('Tokens', 'Token')}
          </span>
        </TokenTypeTagWrapper>
      );
    case CFX_TOKEN_TYPES.erc721:
      return (
        <TokenTypeTagWrapper className={transferType}>
          <span>
            {t(translations.header.tokens721).replace('Tokens', 'Token')}
          </span>
        </TokenTypeTagWrapper>
      );
    case CFX_TOKEN_TYPES.erc20:
      return (
        <TokenTypeTagWrapper className={transferType}>
          <span>
            {t(translations.header.tokens20).replace('Tokens', 'Token')}
          </span>
        </TokenTypeTagWrapper>
      );
    default:
      return null;
  }
};

export const Basic = ({
  address, // address === undefined when token api is pending
  transferType,
  totalSupply,
  price,
  totalPrice,
  quoteUrl,
  symbol,
  decimals,
  tokenAddress,
  holderCount,
  holderIncreasePercent,
  transferCount,
  securityAudit,
  name,
  website,
}: BasicProps) => {
  const { t } = useTranslation();
  if (address && !transferType) {
    transferType = typeof decimals !== 'undefined' ? CFX_TOKEN_TYPES.erc20 : '';
  }

  const fieldPrice = {
    title: (
      <Tooltip text={t(translations.toolTip.token.price)} placement="top">
        {t(translations.token.price)}
      </Tooltip>
    ),
    children:
      price != null ? (
        quoteUrl ? (
          <LinkA href={quoteUrl} target="_blank">
            <Price>{price}</Price>
          </LinkA>
        ) : (
          <Price>{price}</Price>
        )
      ) : address ? (
        t(translations.general.notAvailable)
      ) : undefined,
  };

  const fieldMarketCap = {
    title: (
      <Tooltip text={t(translations.toolTip.token.marketCap)} placement="top">
        {t(translations.token.marketCap, {
          interpolation: { escapeValue: false },
        })}
      </Tooltip>
    ),
    children:
      totalPrice !== undefined ? (
        <Price>{totalPrice}</Price>
      ) : address ? (
        t(translations.general.notAvailable)
      ) : undefined,
  };

  const fieldContractAddress = {
    title: (
      <Tooltip text={t(translations.toolTip.token.contract)} placement="top">
        {t(translations.token.contract)}
      </Tooltip>
    ),
    children:
      tokenAddress !== undefined ? (
        <>
          <AddressContainer value={tokenAddress} />{' '}
          <CopyButton copyText={formatAddress(tokenAddress)} />
        </>
      ) : (
        t(translations.general.security.notAvailable)
      ),
  };

  const fieldDecimal = {
    title: (
      <Tooltip text={t(translations.toolTip.token.decimals)} placement="top">
        {t(translations.token.decimals)}
      </Tooltip>
    ),
    children: address
      ? decimals !== undefined
        ? decimals
        : t(translations.general.notAvailable)
      : undefined,
  };

  const fieldTotalSupply = {
    title: (
      <Tooltip text={t(translations.toolTip.token.totalSupply)} placement="top">
        {t(translations.token.totalSupplay)}
      </Tooltip>
    ),
    children:
      totalSupply !== undefined ? (
        <Text
          hoverValue={`${formatBalance(
            totalSupply,
            transferType === CFX_TOKEN_TYPES.erc20 ? decimals : 0,
            true,
          )} ${symbol}`}
        >
          {`${formatBalance(
            totalSupply,
            transferType === CFX_TOKEN_TYPES.erc20 ? decimals : 0,
          )} ${symbol}`}
        </Text>
      ) : address ? (
        t(translations.general.notAvailable)
      ) : undefined,
  };

  const fieldHolders = {
    title: (
      <Tooltip text={t(translations.toolTip.token.holders)} placement="top">
        {t(translations.token.holders)}
      </Tooltip>
    ),
    children:
      holderCount !== undefined ? (
        <span>
          {toThousands(holderCount)}{' '}
          {holderIncreasePercent !== undefined ? (
            <>
              {holderIncreasePercent > 0 ? (
                <HolderCountPercentWhenUp>
                  (<img src={UpIcon} alt="UpIcon" />
                  &nbsp;
                  {(holderIncreasePercent * 100).toFixed(3)}%)
                </HolderCountPercentWhenUp>
              ) : holderIncreasePercent < 0 ? (
                <HolderCountPercentWhenDown>
                  (<img src={DownIcon} alt="DownIcon" />
                  &nbsp;
                  {(-holderIncreasePercent * 100).toFixed(3)}%)
                </HolderCountPercentWhenDown>
              ) : (
                <HolderCountPercentWhenZero>
                  (<img src={FlatIcon} alt="FlatIcon" />
                  &nbsp;
                  {(holderIncreasePercent * 100).toFixed(3)}%)
                </HolderCountPercentWhenZero>
              )}{' '}
              <Tag style={{ transform: 'translateY(-1px) scale(0.8)' }}>
                24H
              </Tag>
            </>
          ) : undefined}
        </span>
      ) : address ? (
        <span>{t(translations.general.notAvailable)}</span>
      ) : undefined,
  };

  const fieldTransfers = {
    title: (
      <Tooltip text={t(translations.toolTip.token.transfers)} placement="top">
        {t(translations.token.transfers)}
      </Tooltip>
    ),
    children:
      transferCount !== undefined
        ? toThousands(transferCount)
        : address
        ? t(translations.general.notAvailable)
        : undefined,
  };
  const fieldProjectInfo = {
    title: (
      <Tooltip text={t(translations.toolTip.token.transfers)} placement="top">
        {t(translations.general.table.token.projectInfo.projectInfo)}
      </Tooltip>
    ),
    children: securityAudit ? (
      name ? (
        <ProjectInfo
          securityAudit={securityAudit}
          tokenName={name}
          isDetailPage={true}
        />
      ) : undefined
    ) : undefined,
  };
  const fieldTokenWebsite = {
    title: t(translations.token.website),
    children: website || '--',
  };

  let list: any;

  if (transferType === CFX_TOKEN_TYPES.erc20) {
    list = [
      fieldPrice,
      fieldContractAddress,
      fieldMarketCap,
      fieldDecimal,
      fieldTotalSupply,
      fieldHolders,
      fieldProjectInfo,
      fieldTokenWebsite,
      fieldTransfers,
    ];
  } else if (transferType === CFX_TOKEN_TYPES.erc721) {
    list = [
      fieldTotalSupply,
      fieldContractAddress,
      fieldHolders,
      fieldTransfers,
      fieldProjectInfo,
      fieldTokenWebsite,
    ];
  } else {
    list = [
      fieldTransfers,
      fieldContractAddress,
      fieldHolders,
      fieldProjectInfo,
      fieldTokenWebsite,
    ];
  }

  return (
    <BasicWrap>
      {list.length ? <List list={list} /> : null}
      {tokenTypeTag(t, transferType)}
    </BasicWrap>
  );
};

const BasicWrap = styled.div`
  position: relative;
  margin-bottom: 2.2857rem;
`;

export const TokenTypeTagWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 118px;
  height: 30px;
  z-index: 1;
  padding-right: 5px;
  line-height: 30px;
  text-align: right;
  color: #fff;

  span {
    display: inline-block;
    width: 95px;
    font-size: 12px;
    text-align: center;
  }

  &.ERC20 {
    background: url(${CRC20bg}) no-repeat right top;
    background-size: 118px 30px;
  }

  &.ERC721 {
    background: url(${CRC721bg}) no-repeat right top;
    background-size: 118px 30px;
  }

  &.ERC1155 {
    background: url(${CRC1155bg}) no-repeat right top;
    background-size: 118px 30px;
  }
`;

const HolderCountPercentWhenUp = styled.span`
  color: #4ac0aa;
`;
const HolderCountPercentWhenDown = styled.span`
  color: #e36057;
`;
const HolderCountPercentWhenZero = styled.span`
  color: #6f7282;
`;
