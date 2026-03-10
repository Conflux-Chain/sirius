import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { contractColunms, utils } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Contracts() {
  const { t } = useTranslation();

  const columnsWidth = [3, 10, 8, 5];
  const columns = [
    utils.number,
    contractColunms.name,
    contractColunms.contract,
    contractColunms.transactionCount,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const url = `/contract/internals`;

  return (
    <>
      <Helmet>
        <title>{t(translations.contracts.title)}</title>
        <meta
          name="description"
          content={t(translations.contracts.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.contracts.title)}</PageHeader>

      <TablePanelNew
        url={url}
        columns={columns}
        rowKey="address"
      ></TablePanelNew>
    </>
  );
}
