import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { media } from 'styles/media';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TablePanel } from '../../components/TablePanel';
import { useTableData } from '../../components/TabsTablePanel';
import { transactionColunms } from '../../../utils/tableColumns';
import { toThousands } from '../../../utils';
import styled from 'styled-components/macro';
import { PageHeader } from '../../components/PageHeader/Loadable';

export function Transactions() {
  const { t } = useTranslation();
  const url = '/transaction';

  const columnsTransactionsWidth = [4, 5, 5, 4, 3, 4, 5];
  const columnsTransactions: ColumnsType = [
    transactionColunms.hash,
    transactionColunms.from,
    transactionColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age,
  ].map((item, i) => ({ ...item, width: columnsTransactionsWidth[i] }));

  const { total } = useTableData(url);
  const tip = (
    <StyledTipLabelWrapper>
      {t(translations.transactions.tipCountBefore)}
      <StyledSpan>{toThousands(total)}</StyledSpan>
      {t(translations.transactions.tipCountAfter)}
    </StyledTipLabelWrapper>
  );

  return (
    <>
      <Helmet>
        <title>{t(translations.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.transactions.description)}
        />
      </Helmet>
      <TabsTablePanelWrapper>
        <PageHeader>{t(translations.transactions.title)}</PageHeader>
        <TablePanel
          url={url}
          table={{
            columns: columnsTransactions,
            rowKey: 'hash',
          }}
          tableHeader={tip}
        ></TablePanel>
      </TabsTablePanelWrapper>
    </>
  );
}

const TabsTablePanelWrapper = styled.div`
  margin-top: 1.2rem;
  ${media.s} {
    margin-top: 2.2rem;
  }
`;

const StyledTipLabelWrapper = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #74798c;
  margin: 0.5rem 0;
`;

const StyledSpan = styled.span`
  color: #1e3de4;
  padding: 0 0.4286rem;
`;
