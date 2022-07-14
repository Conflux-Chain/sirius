import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Leaderboard } from './Leaderboard';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { IncomingRankList } from './IncomingRankList';

export function IncomingRank() {
  const { t } = useTranslation();

  const tabs = [
    {
      value: 'top-100',
      label: t(translations.pos.incomingRank.top100),
      content: <IncomingRankList />,
    },
    {
      value: 'more',
      label: t(translations.pos.incomingRank.last30days),
      content: <Leaderboard />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{'PoS ' + t(translations.pos.incomingRank.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.incomingRank.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.incomingRank.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
