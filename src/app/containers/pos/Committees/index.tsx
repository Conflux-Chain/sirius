import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { committeeColunms } from 'utils/tableColumns/pos';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export const List = ({ overview }: { overview?: boolean }) => {
  const url = '/stat/list-pos-committee';
  const columnsWidth = [3, 2, 4];
  const columns = [
    committeeColunms.epoch,
    committeeColunms.nodesCount,
    committeeColunms.totalVotes,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      pagination={overview ? false : undefined}
    ></TablePanelNew>
  );
};

export function Committees() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{'PoS ' + t(translations.pos.committees.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.committees.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.committees.title)}</PageHeader>
      <List />
    </>
  );
}
