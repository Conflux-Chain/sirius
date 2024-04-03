import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useParams } from 'react-router-dom';
import { getCommittee } from 'utils/rpcRequest';

import { Overview } from './Overview';
import { VotesDistribution } from './votesDistribution';

export function Committee() {
  const { t } = useTranslation();

  const { blockNumber } = useParams<{
    blockNumber: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({
    currentCommittee: {
      nodes: [],
    },
    elections: [],
  });

  useEffect(() => {
    setLoading(true);

    getCommittee(blockNumber).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [blockNumber]);

  const tabs = [
    {
      value: 'overview',
      label: t(translations.pos.committee.overview.title),
      content: <Overview data={data.currentCommittee} loading={loading} />,
    },
    {
      value: 'votes-distribution',
      label: t(translations.pos.committee.votesDistribution.title),
      content: (
        <VotesDistribution
          data={data.currentCommittee.nodes}
          loading={loading}
        />
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>PoS {t(translations.pos.committee.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.committee.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.committee.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
