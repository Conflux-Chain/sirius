import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { contractColunms, accountColunms } from 'utils/tableColumns';
import queryString from 'query-string';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

export function RegisteredContracts() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const { skip = 0, limit = 10 } = qs.parse(search);
  const current = Math.floor(Number(skip) / Number(limit)) + 1;
  const pageSize = Math.floor(Number(limit));

  let url = queryString.stringifyUrl({
    url: '/contract?reverse=true&orderBy=balance',
    query: {
      fields: ['name', 'icon', 'balance'],
    },
  });

  const columnsWidth = [1, 3, 4, 2, 2];
  const columns = [
    contractColunms.number(current, pageSize),
    contractColunms.name,
    contractColunms.contract,
    {
      ...accountColunms.balance,
      sorter: true,
    },
    {
      ...contractColunms.transactionCount,
      sorter: true,
    },
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  return (
    <>
      <Helmet>
        <title>{t(translations.registeredContracts.title)}</title>
        <meta
          name="description"
          content={t(translations.registeredContracts.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.registeredContracts.title)}</PageHeader>

      <TablePanelNew
        url={url}
        columns={columns}
        rowKey="address"
      ></TablePanelNew>
    </>
  );
}
