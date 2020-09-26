import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import TablePanel from '../../components/TablePanel';
import { TipLabel, ColumnsType } from '../../components/TabsTablePanel';
import styled from 'styled-components';
import Text from '../../components/Text';
import PageHeader from '../../components/PageHeader';
import { media } from '../../../styles/media';
import numeral from 'numeral';

const StyledTokensWrapper = styled.div`
  max-width: 73.1429rem;
  margin: 0 auto;

  ${media.s} {
    padding: 0.2857rem 1.1429rem 1.1429rem;
  }
`;

const StyledTextWrapper = styled.span`
  font-family: CircularStd-Book, CircularStd;
  font-weight: 400;
  line-height: 1.7143rem;
  font-size: 1rem;
  &:hover {
    font-family: CircularStd-Bold, CircularStd;
    font-weight: 500;
    color: #0054fe;
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

const StyledTipLabelWrapper = styled.div`
  p {
    margin-top: 2.1429rem;
    margin-bottom: 0.8571rem;
  }

  ${media.s} {
    p {
      margin-top: 1.1429rem;
      margin-bottom: 0.4286rem;
    }
  }
`;

const renderTextEllipsis = value => {
  return (
    <Text span maxwidth={'5.7143rem'} hoverValue={value}>
      <StyledTextWrapper>{value}</StyledTextWrapper>
    </Text>
  );
};

export const Tokens = () => {
  const { t } = useTranslation();
  const [tip, setTip] = useState<any>();

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
              <img src={item.icon} />
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

  return (
    <StyledTokensWrapper>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      {tip}
      <PageHeader>{t(translations.tokens.title)}</PageHeader>
      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
        }}
        url="/token/list"
        onDataChange={({ data }) => {
          const left = t(translations.tokens.tipCountBefore);
          const right = t(translations.tokens.tipCountAfter, {
            type: 'blocks',
          });

          setTip(
            <StyledTipLabelWrapper>
              <TipLabel
                count={data ? data.result?.total : 0}
                left={left}
                right={right}
                key="blocks"
              />
            </StyledTipLabelWrapper>,
          );
        }}
      />
    </StyledTokensWrapper>
  );
};
