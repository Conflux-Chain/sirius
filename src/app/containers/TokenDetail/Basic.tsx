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
import numeral from 'numeral';
import { formatBalance, formatString } from '../../../utils';

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
      title: (
        <Tooltip
          text={t(translations.toolTip.token.totalSupply)}
          placement="top"
        >
          {t(translations.token.totalSupplay)}
        </Tooltip>
      ),
      children:
        totalSupply !== undefined ? (
          <Text
            hoverValue={`${formatBalance(
              totalSupply,
              decimals,
              true,
            )} ${symbol}`}
          >
            {`${formatBalance(totalSupply, decimals)} ${symbol}`}
          </Text>
        ) : undefined,
    },
    {
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
    },
    {
      title: (
        <Tooltip text={t(translations.toolTip.token.holders)} placement="top">
          {t(translations.token.holders)}
        </Tooltip>
      ),
      children: <span>--</span>,
      // accountTotal !== undefined
      //   ? `${numeral(accountTotal).format('0,0')} ${t(
      //       translations.token.address,
      //     )}`
      //   : undefined,
    },
    {
      title: (
        <Tooltip text={t(translations.toolTip.token.decimals)} placement="top">
          {t(translations.token.decimals)}
        </Tooltip>
      ),
      children: decimals,
    },
    {
      title: (
        <Tooltip text={t(translations.toolTip.token.transfers)} placement="top">
          {t(translations.token.transfers)}
        </Tooltip>
      ),
      children:
        transferCount !== undefined
          ? numeral(transferCount).format('0,0')
          : undefined,
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
