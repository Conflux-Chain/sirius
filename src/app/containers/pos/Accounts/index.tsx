import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { accountColunms, colunms } from 'utils/tableColumns/pos';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'sirius-next/packages/common/dist/utils/hooks/useAge';

export const List = ({ overview }: { overview?: boolean }) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = '/stat/list-pos-account?orderBy=createdAt&reverse=true';
  const columnsWidth = [4, 4, 4, 4, 5];
  const columns = [
    colunms.posAddress,
    accountColunms.currentCommitteeMember,
    {
      ...accountColunms.availableVotes,
    },
    accountColunms.votesInCommittee,
    {
      ...colunms.age(ageFormat, toggleAgeFormat),
      sorter: !overview,
      defaultSortOrder: 'descend' as 'descend',
      sortDirections: ['descend', 'descend', 'descend'] as Array<'descend'>,
      showSorterTooltip: false,
    },
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
