import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { Overview } from './Overview';
import { Transactions } from './Transactions';
import { useParams } from 'react-router-dom';
import { getBlockByHash } from 'utils/rpcRequest';

export function Block() {
  const { t } = useTranslation();

  const { hash } = useParams<{
    hash: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    getBlockByHash(hash).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [hash]);

  const tabs = [
    {
      value: 'overview',
      label: t(translations.pos.block.overview.title),
      content: <Overview data={data} loading={loading} />,
    },
    {
      value: 'transactions',
      label: t(translations.pos.block.transactions.title),
      content: <Transactions height={data.blockHeight} loading={loading} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>PoS {t(translations.pos.block.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.block.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.block.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
