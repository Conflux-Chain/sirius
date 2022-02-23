import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { colunms, transactionColunms } from 'utils/tableColumns/pos';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'utils/hooks/useAge';

export const List = () => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = '/stat/list-pos-tx?orderBy=createdAt&reverse=true';
  const columnsWidth = [4, 4, 4, 4, 5];
  const columns = [
    transactionColunms.txHash,
    {
      ...colunms.posBlockHash,
      key: 'block.hash',
      dataIndex: ['block', 'hash'],
    },
    transactionColunms.status,
    transactionColunms.type,
    {
      ...colunms.age(ageFormat, toggleAgeFormat),
      sorter: true,
      defaultSortOrder: 'descend' as 'descend',
      sortDirections: ['descend', 'descend', 'descend'] as Array<'descend'>,
      showSorterTooltip: false,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return <TablePanelNew url={url} columns={columns}></TablePanelNew>;
};

export function Transactions() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t(translations.pos.transactions.title)}</title>
        <meta
          name="description"
          content={t(translations.pos.transactions.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.transactions.title)}</PageHeader>
      <List />
    </>
  );
}
