/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from '../../components/List/Loadable';
import { Text } from '../../components/Text/Loadable';
import { Tooltip } from '../../components/Tooltip/Loadable';
import { formatBalance, formatNumber, toThousands } from '../../../utils';
import { cfxTokenTypes } from '../../../utils/constants';
import { AddressContainer } from '../../components/AddressContainer';
import { LinkA } from '../../../utils/tableColumns/token';

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
      price != null ? (
        <Text hoverValue={`$${price}`}>
          {quoteUrl ? (
            <LinkA href={quoteUrl} target="_blank">
              ${formatNumber(price || 0, { withUnit: false })}
            </LinkA>
          ) : (
            `$${formatNumber(price || 0, { withUnit: false })}`
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
        <Text hoverValue={totalPrice != null ? `$${totalPrice}` : '-'}>
          {totalPrice != null && totalPrice > 0
            ? `$${formatNumber(totalPrice || 0, { unit: 'K' })}`
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
        <AddressContainer value={tokenAddress} />
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
    list = [fieldTransfers, fieldContractAddress, fieldHolders];
  }
  return <BasicWrap>{list.length ? <List list={list} /> : null}</BasicWrap>;
};

const BasicWrap = styled.div`
  margin-bottom: 2.2857rem;
`;