import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'sirius-next/packages/common/dist/components/PageHeader';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { useParams } from 'react-router-dom';
import { getTransactionByNumber } from 'utils/rpcRequest';

import { Overview } from './Overview';

export function Transaction() {
  const { t } = useTranslation();

  const { number } = useParams<{
    number: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    setLoading(true);

    getTransactionByNumber(number).then(data => {
      setData(data);
      setLoading(false);
    });
  }, [number]);

  const tabs = [
    {
      value: 'overview',
      label: t(translations.pos.transaction.overview.title),
      content: <Overview data={data} loading={loading} />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>PoS {t(translations.pos.transaction.title)}</title>
        <meta
          name="description"
          content={'PoS ' + t(translations.pos.transaction.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.pos.transaction.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </>
  );
}
