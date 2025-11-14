import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import styled from 'styled-components';
import { EventLogs } from './EventLogs/Loadable';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { reqTransactionDetail } from 'utils/httpRequest';
import { useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Detail } from './Detail';
import { getTransactionByHash } from 'utils/rpcRequest';
import { InternalTxns } from 'app/containers/Transactions/Loadable';
import { ReactComponent as JsonIcon } from 'images/json.svg';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { viewJson } from '@cfxjs/sirius-next-common/dist/utils';

export function Transaction() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const history = useHistory();
  const [txnDetail, setTxnDetail] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [partLoading, setPartLoading] = useState(false); // partial update indicator

  // get txn detail info
  const fetchTxDetail = useCallback(
    (initial = true) => {
      if (initial) {
        setLoading(true);
      } else {
        // only update timestamp & confirmedEpochCount
        setPartLoading(true);
      }
      reqTransactionDetail({
        hash,
      })
        .then(body => {
          if (!body?.hash) {
            history.push(`/notfound/${hash}`, {
              type: 'transaction',
            });
          }

          if (body.code) {
            switch (body.code) {
              case 30404:
                history.push(`/notfound/${hash}`, {
                  type: 'transaction',
                });
                break;
            }
          } else {
            //success
            setTxnDetail(body || {});
          }
        })
        .finally(() => {
          setLoading(false);
          setPartLoading(false);
        });
    },
    [history, hash],
  );

  useEffect(() => {
    fetchTxDetail();
    // auto update tx detail info
    const autoUpdateDetailIntervalId = setInterval(() => {
      fetchTxDetail(false);
    }, 10 * 1000);
    return () => {
      clearInterval(autoUpdateDetailIntervalId);
    };
  }, [fetchTxDetail]);

  const { from, to, eventLogCount } = txnDetail;

  let tabs: any[] = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: (
        <Detail
          data={txnDetail}
          loading={loading}
          partLoading={partLoading}
          key={hash}
        />
      ),
    },
    {
      value: 'internal-txns',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.internalTxns.title),
      content: <InternalTxns address={hash} from={from} to={to} key={hash} />,
      // hidden: cfxTransferAllCount < 2,
    },
    {
      value: 'logs',
      label: () => {
        return (
          <TabLabel showTooltip={false}>
            {t(translations.transaction.logs.title)}
          </TabLabel>
        );
      },
      content: <EventLogs hash={hash} key={hash}></EventLogs>,
      hidden: !eventLogCount,
    },
  ];

  const handleViewRawTxJson = async () => {
    const transaction = await getTransactionByHash(hash);
    viewJson(transaction);
  };

  return (
    <StyledPageWrapper>
      <Helmet>
        <title>{t(translations.transaction.title)}</title>
        <meta
          name="description"
          content={t(translations.transaction.description)}
        />
      </Helmet>
      <PageHeader>{t(translations.transaction.title)}</PageHeader>
      <div className="content-wrapper">
        <div className="raw-tx-json-wrapper">
          <Tooltip title={t(translations.toolTip.tx.getRawTxJson)}>
            <div className="raw-tx-json" onClick={handleViewRawTxJson}>
              <JsonIcon style={{ width: '24px', height: '24px' }} />
            </div>
          </Tooltip>
        </div>
        <TabsTablePanel tabs={tabs} />
      </div>
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
  .content-wrapper {
    position: relative;
    .raw-tx-json-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      height: 3.2857rem;
      display: flex;
      align-items: center;
      .raw-tx-json {
        cursor: pointer;
        background: #fefefe;
        border: 1px solid #ebeced;
        height: 32px;
        display: flex;
        align-items: center;
        border-radius: 16px;
        color: #686c7e;
        padding: 0 16px;
      }
    }
  }
`;
