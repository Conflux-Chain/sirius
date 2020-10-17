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
      title: t(translations.tokenDetail.totalSupplay),
      children: totalSupply,
    },
    {
      title: t(translations.tokenDetail.contract),
      children: tokenAddress,
    },
    {
      title: t(translations.tokenDetail.holders),
      children: accountTotal,
    },
    {
      title: t(translations.tokenDetail.decimals),
      children: decimals,
    },
    {
      title: t(translations.tokenDetail.transfers),
      children: transferCount,
    },
  ];

  return (
    <BasicWrap>
      <List list={list} />
    </BasicWrap>
  );
};

const BasicWrap = styled.div`
  margin-bottom: 2.2857rem;
`;
