import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { TablePanel } from '../../components/TablePanel/Loadable';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TipLabel } from '../../components/TabsTablePanel/Loadable';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { useTableData } from './../../components/TabsTablePanel/useTableData';
import { tokenColunms } from '../../../utils/tableColumns';

export function Tokens() {
  const { t } = useTranslation();

  const columnsWidth = [2, 6, 3, 4, 3, 3];
  const columns: ColumnsType = [
    tokenColunms.number,
    tokenColunms.token,
    tokenColunms.transfer,
    tokenColunms.totalSupply,
    tokenColunms.holders,
    tokenColunms.contract,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const url = `/token?fields=transferCount,icon`;
  const { total } = useTableData(url);

  return (
    <>
      <Helmet>
        <title>{t(translations.tokens.title)}</title>
        <meta name="description" content={t(translations.tokens.description)} />
      </Helmet>
      <TipLabel
        total={total}
        left={t(translations.tokens.tipCountBefore)}
        right={t(translations.tokens.tipCountAfter)}
      />
      <PageHeader>{t(translations.tokens.title)}</PageHeader>
      <TablePanel
        table={{
          columns: columns,
          rowKey: 'address',
        }}
        url={url}
      />
    </>
  );
}
