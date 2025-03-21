import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { transactionColumns } from 'utils/tableColumns';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Transactions() {
  const { t } = useTranslation();
  const [ageFormat, toggleAgeFormat] = useAge();

  const columnsTransactionsWidth = [4, 3, 6, 6, 3, 4, 4, 5];
  const columnsTransactions = [
    transactionColumns.hash,
    transactionColumns.method,
    transactionColumns.from,
    transactionColumns.to,
    transactionColumns.value,
    transactionColumns.gasPrice,
    transactionColumns.gasFee,
    transactionColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({
    ...item,
    width: columnsTransactionsWidth[i],
  }));

  return (
    <>
      <Helmet>
        <title>{t(translations.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.transactions.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transactions.title)}</PageHeader>

      <TablePanelNew
        url="/transaction"
        columns={columnsTransactions}
        rowKey="hash"
      ></TablePanelNew>
    </>
  );
}
