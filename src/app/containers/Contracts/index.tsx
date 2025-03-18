import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TipLabel } from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { useTableData } from 'app/components/TabsTablePanel/useTableData';
import { contractColumns, utils } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export function Contracts() {
  const { t } = useTranslation();

  const columnsWidth = [3, 10, 8, 5];
  const columns = [
    utils.number,
    contractColumns.name,
    contractColumns.contract,
    contractColumns.transactionCount,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const url = `/contract/internals`;
  const { total } = useTableData(url);

  return (
    <>
      <Helmet>
        <title>{t(translations.contracts.title)}</title>
        <meta
          name="description"
          content={t(translations.contracts.description)}
        />
      </Helmet>
      <PageHeader
        subtitle={
          <TipLabel
            total={total}
            left={t(translations.contracts.tipCountBefore)}
            right={t(translations.contracts.tipCountAfter)}
          />
        }
      >
        {t(translations.contracts.title)}
      </PageHeader>

      <TablePanelNew
        url={url}
        columns={columns}
        rowKey="address"
      ></TablePanelNew>
    </>
  );
}
