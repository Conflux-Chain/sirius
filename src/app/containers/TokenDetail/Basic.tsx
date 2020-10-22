/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from '../../components/List/Loadable';
import { Link } from '../../components/Link/Loadable';
import numeral from 'numeral';

export interface BasicProps {
  totalSupply?: string;
  symbol?: string;
  name?: string;
  tokenAddress?: string;
  accountTotal?: number;
  decimals?: number;
  transferCount?: number;
}

export const Basic = ({
  totalSupply,
  symbol,
  decimals,
  tokenAddress,
  accountTotal,
  transferCount,
}: BasicProps) => {
  const { t } = useTranslation();

  const list = [
    {
      title: t(translations.token.totalSupplay),
      children: `${totalSupply} ${symbol}`,
    },
    {
      title: t(translations.token.contract),
      children: <Link href={`/address/${tokenAddress}`}>{tokenAddress}</Link>,
    },
    {
      title: t(translations.token.holders),
      children: `${numeral(accountTotal).format('0,0')} ${t(
        translations.token.address,
      )}`,
    },
    {
      title: t(translations.token.decimals),
      children: decimals,
    },
    {
      title: t(translations.token.transfers),
      children: numeral(transferCount).format('0,0'),
    },
  ];

  if (!accountTotal) {
    list.splice(2, 1);
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
