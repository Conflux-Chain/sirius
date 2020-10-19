/**
 * TokenDetail
 */
import React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { List } from '../../components/List/Loadable';

export interface BasicProps {
  totalSupply?: string;
  tokenAddress?: string;
  accountTotal?: number;
  decimals?: number;
  transferCount?: number;
}

export const Basic = ({
  totalSupply,
  tokenAddress,
  accountTotal,
  decimals,
  transferCount,
}: BasicProps) => {
  const { t } = useTranslation();

  const list = [
    {
      title: t(translations.token.totalSupplay),
      children: totalSupply,
    },
    {
      title: t(translations.token.contract),
      children: tokenAddress,
    },
    {
      title: t(translations.token.holders),
      children: accountTotal,
    },
    {
      title: t(translations.token.decimals),
      children: decimals,
    },
    {
      title: t(translations.token.transfers),
      children: transferCount,
    },
  ];

  if (totalSupply && !accountTotal) {
    list.splice(
      2,
      3,
      {
        title: t(translations.token.transfers),
        children: transferCount,
      },
      {
        title: t(translations.token.decimals),
        children: decimals,
      },
    );
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
