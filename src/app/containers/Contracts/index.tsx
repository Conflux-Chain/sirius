import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { TipLabel } from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTableData } from 'app/components/TabsTablePanel/useTableData';
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
