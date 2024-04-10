import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Tooltip } from 'app/components/Tooltip/Loadable';
import {
  TabLabel,
  TabsTablePanel,
} from 'app/components/TabsTablePanel/Loadable';
import { useParams } from 'react-router-dom';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Helmet } from 'react-helmet-async';
import { DescriptionPanel } from './DescriptionPanel';
import styled from 'styled-components';
import { reqBlockDetail } from 'utils/httpRequest';
import { useBreakpoint } from 'styles/media';
import { useHistory } from 'react-router-dom';

import { Txns } from './Txns';
import { ReferenceBlocks } from './ReferenceBlocks';

export function Block() {
  const history = useHistory();
  const bp = useBreakpoint();
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const [blockDetail, setBlockDetail] = useState<any>({
    transactionCount: 0,
    refereeHashes: [],
    initial: true, // identify for send request or not
  });
  const [loading, setLoading] = useState(false);

  const { transactionCount, refereeHashes } = blockDetail;

  useEffect(() => {
    setLoading(true);
    reqBlockDetail({
      hash,
    })
      .then(data => {
        setBlockDetail(data);
      })
      .finally(() => setLoading(false));
  }, [hash]);

  useEffect(() => {
    if (!blockDetail.initial && !blockDetail.hash) {
      history.push(`/notfound/${hash}`, {
        type: 'block',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, blockDetail]);

  const tabs = [
    {
      value: 'overview',
      label: t(translations.block.overview),
      content: <DescriptionPanel data={blockDetail} loading={loading} />,
    },
    {
      value: 'transactions',
      action: 'blockTransactions',
      label: () => {
        return (
          <TabLabel
            // total={transactionCount}
            // realTotal={transactionCount}
            showTooltip={bp !== 's'}
          >
            {bp === 's' ? (
              t(translations.block.tabs.transactions)
            ) : (
              <Tooltip
                text={t(translations.toolTip.block.transactions)}
                placement="top"
              >
                {t(translations.block.tabs.transactions)}
              </Tooltip>
            )}
          </TabLabel>
        );
      },
      content: <Txns url={`/transaction?blockHash=${hash}`} />,
      hidden: !transactionCount,
    },
    {
      value: 'reference-blocks',
      action: 'blockTransactions',
      label: () => {
        return (
          <TabLabel
            // total={refereeHashes?.length}
            showTooltip={bp !== 's'}
          >
            {bp === 's' ? (
              t(translations.block.tabs.referenceBlocks)
            ) : (
              <Tooltip
                text={t(translations.toolTip.block.referenceBlocks)}
                placement="top"
              >
                {t(translations.block.tabs.referenceBlocks)}
              </Tooltip>
            )}
          </TabLabel>
        );
      },
      content: <ReferenceBlocks url={`/block?referredBy=${hash}`} />,
      hidden: !refereeHashes?.length,
    },
  ];

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.block.title)}</title>
        <meta name="description" content={t(translations.block.description)} />
      </Helmet>
      <PageHeader>{t(translations.block.title)}</PageHeader>
      <TabsTablePanel tabs={tabs} />
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
`;
