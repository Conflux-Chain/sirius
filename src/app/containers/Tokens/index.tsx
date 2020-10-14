import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import TablePanel from '../../components/TablePanel';
import { TipLabel, ColumnsType } from '../../components/TabsTablePanel';
import styled from 'styled-components';
import Text from '../../components/Text';
import PageHeader from '../../components/PageHeader';
import numeral from 'numeral';
import useTableData from './../../components/TabsTablePanel/useTableData';

const StyledTextWrapper = styled.span`
  font-weight: 400;
  line-height: 1.7143rem;
  font-size: 1rem;
  &:hover {
    font-weight: 500;
    color: #1e3de4;
  }
`;

const StyledIconWrapper = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 1.1429rem;
    height: 1.1429rem;
    margin-right: 0.5714rem;
  }
`;

const renderTextEllipsis = value => {
  return (
    <Text span maxWidth={'5.7143rem'} hoverValue={value}>
      <StyledTextWrapper>{value}</StyledTextWrapper>
    </Text>
  );
};

export const Tokens = () => {
  const { t } = useTranslation();

  const columns: ColumnsType = [
    {
      title: t(translations.tokens.table.number),
      dataIndex: 'epochNumber',
      key: 'epochNumber',
      width: 80,
      render: (value, row, index) => {
        return index + 1;
      },
    },
    {
      title: t(translations.tokens.table.token),
      key: 'blockIndex',
      render: item => {
        return (
          <>
            <StyledIconWrapper>
              <img src={item.icon} alt="token icon" />
              {item.name} ({item.symbol})
            </StyledIconWrapper>
          </>
        );
      },
    },
    {
      title: t(translations.tokens.table.transfer),
      dataIndex: 'transferCount',
      key: 'transferCount',
    },
    {
      title: t(translations.tokens.table.totalSupply),
      dataIndex: 'totalSupply',
      key: 'totalSupply',
      render: renderTextEllipsis,
    },
    {
      title: t(translations.tokens.table.holders),
      dataIndex: 'accountTotal',
      key: 'accountTotal',
      render: count => {
        return numeral(count).format('0,0');
      },
    },
    {
      title: t(translations.tokens.table.contract),
      dataIndex: 'address',
      key: 'address',
      render: renderTextEllipsis,
    },
  ];
  const url = '/token/list';
  const { total } = useTableData(url);

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      <TipLabel
        count={total}
        left={t(translations.tokens.tipCountBefore)}
        right={t(translations.tokens.tipCountAfter)}
      />
      <PageHeader>{t(translations.tokens.title)}</PageHeader>
      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
        }}
        url={url}
      />
    </>
  );
};
