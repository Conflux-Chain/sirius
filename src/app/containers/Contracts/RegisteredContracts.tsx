import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TablePanel } from 'app/components/TablePanel/Loadable';
import { ColumnsType } from 'app/components/TabsTablePanel';
import { TipLabel } from 'app/components/TabsTablePanel/Loadable';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTableData } from 'app/components/TabsTablePanel/useTableData';
import { contractColunms, accountColunms } from 'utils/tableColumns';
import queryString from 'query-string';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';

export function RegisteredContracts() {
  const { t } = useTranslation();

  let defaultSortOrder = 'desc';
  let defaultSortKey = 'balance';
  let url = queryString.stringifyUrl({
    url: `/contract?reverse=true&orderBy=${defaultSortKey}`,
    query: {
      fields: ['name', 'icon', 'balance'],
    },
  });

  const [queryUrl, setQueryUrl] = useState(url);
  const [tableSortOrder, setTableSortOrder] = useState(defaultSortOrder);
  const [tableSortKey, setTableSortKey] = useState(defaultSortKey);

  const columnsWidth = [1, 3, 4, 2, 2];
  const columns: ColumnsType = [
    contractColunms.number,
    contractColunms.name,
    contractColunms.contract,
    accountColunms.balance,
    contractColunms.transactionCount,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  // deal with column sort
  const sorter = opt => {
    const { column, url: oldUrl, oldSortKey, newSortKey } = opt;

    // default order is desc
    let newSortOrder =
      oldSortKey === newSortKey
        ? tableSortOrder === 'asc'
          ? 'desc'
          : 'asc'
        : 'desc';
    let urlSortKey = column.dataIndex;

    // generate new url by replace sort params
    const newUrl = oldUrl
      .replace(
        /reverse=[^&]*/g,
        newSortOrder === 'desc' ? 'reverse=true' : 'reverse=false',
      )
      .replace(/orderBy=[^&]*/g, 'orderBy=' + urlSortKey);

    setTableSortKey(column.dataIndex);
    setTableSortOrder(newSortOrder);
    if (newUrl !== oldUrl) {
      setQueryUrl(newUrl);
      trackEvent({
        category: ScanEvent.function.category,
        action: ScanEvent.function.action.tokenTableSort,
        label: `registeredContract_${column.dataIndex}_${newSortOrder}`,
      });
    }
  };

  const { total } = useTableData(queryUrl);

  console.log(11, queryUrl);

  return (
    <>
      <Helmet>
        <title>{t(translations.registeredContracts.title)}</title>
        <meta
          name="description"
          content={t(translations.registeredContracts.description)}
        />
      </Helmet>
      <PageHeader
        subtitle={
          <TipLabel
            total={total}
            left={t(translations.registeredContracts.tipCountBefore)}
            right={t(translations.registeredContracts.tipCountAfter)}
          />
        }
      >
        {t(translations.registeredContracts.title)}
      </PageHeader>

      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
          sorter,
          sortOrder: tableSortOrder,
          sortKey: tableSortKey,
        }}
        url={queryUrl}
      />
    </>
  );
}
