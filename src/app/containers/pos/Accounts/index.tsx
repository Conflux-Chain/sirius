import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { accountColunms } from 'utils/tableColumns/pos';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { toThousands } from 'utils';

export const List = ({ overview }: { overview?: boolean }) => {
  const { t } = useTranslation();
  const url = '/stat/list-pos-account?orderBy=availableVotes&reverse=true';
  const columnsWidth = [2, 5, 5, 4, 4, 4, 5];
  const columns = [
    accountColunms.rank,
    accountColunms.posNodeAddress,
    accountColunms.votingPower,
    accountColunms.active,
    accountColunms.committeeMember,
    accountColunms.votingShare,
    accountColunms.nodeAge,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      url={url}
      columns={columns}
      pagination={overview ? false : undefined}
      title={({ total }) => (
        <span>
          {t(translations.pos.accounts.totalRecord, {
            total: toThousands(total),
          })}
        </span>
      )}
    ></TablePanelNew>
  );
};

export function Accounts() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{'PoS' + t(translations.pos.accounts.title)}</title>
        <meta
          name="description"
          content={'PoS' + t(translations.pos.accounts.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.accounts.title)}</PageHeader>
      <List />
    </>
  );
}
