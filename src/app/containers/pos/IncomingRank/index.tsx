import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { colunms, incomingRankColunms } from 'utils/tableColumns/pos';
import { utils } from 'utils/tableColumns';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';

export const List = () => {
  const url = '/stat/top-pos-account-by-reward';
  const columnsWidth = [0.5, 3, 2];
  const columns = [
    utils.number,
    colunms.posAddress,
    incomingRankColunms.totalIncoming,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      pagination={false}
      hideDefaultTitle
    ></TablePanelNew>
  );
};

export function IncomingRank() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{'PoS ' + t(translations.pos.incomingRank.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.incomingRank.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.pos.incomingRank.subTitle)}>
        {t(translations.pos.incomingRank.title)}
      </PageHeader>
      <List />
    </>
  );
}
