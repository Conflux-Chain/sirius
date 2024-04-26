import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'sirius-next/packages/common/dist/components/PageHeader';
import { contractColunms, accountColunms, utils } from 'utils/tableColumns';
import queryString from 'query-string';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function RegisteredContracts() {
  const { t } = useTranslation();

  let url = queryString.stringifyUrl({
    url: '/contract?reverse=true&orderBy=balance',
    query: {
      fields: ['name', 'iconUrl', 'balance'],
    },
  });

  const columnsWidth = [1, 3, 4, 2, 2];
  const columns = [
    utils.number,
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
