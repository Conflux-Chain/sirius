/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from '../../components/List/Loadable';
import { Link } from '../../components/Link/Loadable';
import { Text } from '../../components/Text/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { formatBalance, formatString, toThousands } from '../../../utils';
import { cfxTokenTypes } from '../../../utils/constants';

export interface BasicProps {
  address?: string;
  tokenType?: string;
  totalSupply?: string;
  price?: string;
  marketCap?: string;
  symbol?: string;
  name?: string;
  tokenAddress?: string;
  holderCount?: number;
  decimals?: number;
  transferCount?: number;
}

export const Basic = ({
  address, // address === undefined when token api is pending
  tokenType,
  totalSupply,
  price,
  marketCap,
  symbol,
  decimals,
  tokenAddress,
  holderCount,
  transferCount,
}: BasicProps) => {
  const { t } = useTranslation();

  const fieldPrice = {
    title: (
      <Tooltip text={t(translations.toolTip.token.price)} placement="top">
        {t(translations.token.price)}
      </Tooltip>
    ),
    children:
      price !== undefined ? (
        <Text hoverValue={`${formatBalance(price, decimals, true)} ${symbol}`}>
          {`${formatBalance(price, decimals)} ${symbol}`}
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
      marketCap !== undefined ? (
        <Text
          hoverValue={`${formatBalance(marketCap, decimals, true)} ${symbol}`}
        >
          {`${formatBalance(marketCap, decimals)} ${symbol}`}
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
        <Text span hoverValue={tokenAddress}>
          {
            <Link href={`/address/${tokenAddress}`}>
              {formatString(tokenAddress || '', 'address')}
            </Link>
          }
        </Text>
      ) : undefined,
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
          hoverValue={`${formatBalance(totalSupply, decimals, true)} ${symbol}`}
        >
          {`${formatBalance(totalSupply, decimals)} ${symbol}`}
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
      holderCount !== undefined
        ? `${toThousands(holderCount)} ${t(translations.token.address)}`
        : undefined,
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

  let list = [
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

  if (
    tokenType === cfxTokenTypes.erc721 ||
    tokenType === cfxTokenTypes.erc1155
  ) {
    list = [
      fieldTotalSupply,
      fieldContractAddress,
      fieldHolders,
      null,
      fieldTransfers,
    ];
  }
  return (
    <BasicWrap>
      <List list={list} />
    </BasicWrap>
  );
};

const BasicWrap = styled.div`
  margin-bottom: 2.2857rem;
`;
