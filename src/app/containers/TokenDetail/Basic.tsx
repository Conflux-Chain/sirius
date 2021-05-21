/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from 'app/components/List/Loadable';
import { Text } from 'app/components/Text/Loadable';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import { formatBalance, formatNumber, toThousands } from 'utils';
import { cfxTokenTypes, getCurrencySymbol } from 'utils/constants';
import { AddressContainer } from 'app/components/AddressContainer';
import { LinkA } from 'utils/tableColumns/token';
import CRC20bg from 'images/token/crc20bg.png';
import CRC721bg from 'images/token/crc721bg.png';
import CRC1155bg from 'images/token/crc1155bg.png';
import DownIcon from 'images/token/down.svg';
import UpIcon from 'images/token/up.svg';
import FlatIcon from 'images/token/flat.svg';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils/cfx';

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
}

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
}: BasicProps) => {
  const { t } = useTranslation();

  const CURRENCY_SYMBOL = getCurrencySymbol();

  const fieldPrice = {
    title: (
      <Tooltip text={t(translations.toolTip.token.price)} placement="top">
        {t(translations.token.price)}
      </Tooltip>
    ),
    children:
      price != null ? (
        <Text hoverValue={`${CURRENCY_SYMBOL}${price}`}>
          {quoteUrl ? (
            <LinkA href={quoteUrl} target="_blank">
              {CURRENCY_SYMBOL}
              {formatNumber(price || 0, { withUnit: false })}
            </LinkA>
          ) : (
            `${CURRENCY_SYMBOL}${formatNumber(price || 0, { withUnit: false })}`
          )}
        </Text>
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
        <Text
          hoverValue={
            totalPrice != null ? `${CURRENCY_SYMBOL}${totalPrice}` : '-'
          }
        >
          {totalPrice != null && totalPrice > 0
            ? `${CURRENCY_SYMBOL}${formatNumber(totalPrice || 0, {
                unit: 'K',
              })}`
            : '-'}
        </Text>
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
            transferType === cfxTokenTypes.erc20 ? decimals : 0,
            true,
          )} ${symbol}`}
        >
          {`${formatBalance(
            totalSupply,
            transferType === cfxTokenTypes.erc20 ? decimals : 0,
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
            holderIncreasePercent > 0 ? (
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
            )
          ) : undefined}
        </span>
      ) : undefined,
  };

  const fieldTransfers = {
    title: (
      <Tooltip text={t(translations.toolTip.token.transfers)} placement="top">
        {t(translations.token.transfers)}
      </Tooltip>
    ),
    children:
      transferCount !== undefined ? toThousands(transferCount) : undefined,
  };

  let list: any;

  if (transferType === cfxTokenTypes.erc20) {
    list = [
      fieldPrice,
      fieldContractAddress,
      fieldMarketCap,
      fieldDecimal,
      fieldTotalSupply,
      null,
      fieldHolders,
      null,
      fieldTransfers,
    ];
  } else if (transferType === cfxTokenTypes.erc721) {
    list = [
      fieldTotalSupply,
      fieldContractAddress,
      fieldHolders,
      null,
      fieldTransfers,
    ];
  } else {
    list = [fieldTransfers, fieldContractAddress];
  }

  const tokenTypeTag = transferType => {
    switch (transferType) {
      case cfxTokenTypes.erc1155:
        return (
          <TokenTypeTag className={transferType}>
            <span>
              {t(translations.header.tokens1155).replace('Tokens', 'Token')}
            </span>
          </TokenTypeTag>
        );
      case cfxTokenTypes.erc721:
        return (
          <TokenTypeTag className={transferType}>
            <span>
              {t(translations.header.tokens721).replace('Tokens', 'Token')}
            </span>
          </TokenTypeTag>
        );
      case cfxTokenTypes.erc20:
        return (
          <TokenTypeTag className={transferType}>
            <span>
              {t(translations.header.tokens20).replace('Tokens', 'Token')}
            </span>
          </TokenTypeTag>
        );
      default:
        return null;
    }
  };

  return (
    <BasicWrap>
      {list.length ? <List list={list} /> : null}
      {tokenTypeTag(transferType)}
    </BasicWrap>
  );
};

const BasicWrap = styled.div`
  position: relative;
  margin-bottom: 2.2857rem;
`;

const TokenTypeTag = styled.div`
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
