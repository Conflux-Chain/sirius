import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnsType } from 'app/components/TabsTablePanel';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import styled from 'styled-components/macro';
import { EventLogs } from './EventLogs/Loadable';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { AddressContainer } from 'app/components/AddressContainer';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils/cfx';
import { reqTransactionDetail } from 'utils/httpRequest';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Detail } from './Detail';

export function Transaction() {
  const { t } = useTranslation();
  const { hash } = useParams<{
    hash: string;
  }>();
  const [txnDetail, setTxnDetail] = useState<any>({});

  useEffect(() => {
    reqTransactionDetail({
      hash,
    }).then(body => {
      setTxnDetail(body);
    });
  }, [hash]);

  const {
    from,
    to,
    // cfxTransferCount,
    cfxTransferAllCount,
    eventLogCount,
  } = txnDetail;

  const fromContent = (isFull = false) => (
    <span>
      <AddressContainer value={from} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(from)} />
    </span>
  );
  const toContent = (isFull = false) => (
    <span>
      <AddressContainer value={to} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(to)} />
    </span>
  );

  const columnsCFXTransferWidth = [3, 4, 4, 2, 4];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.traceType,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.traceResult,
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  let tableHeader = ({ total }) => {
    return (
      <StyledTipWrapper>
        <div>
          {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
          {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
          {t(translations.transaction.internalTxnsTip.produced)}{' '}
          <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
          {t(translations.transaction.internalTxnsTip.txns)}
        </div>
      </StyledTipWrapper>
    );
  };

  let tabs: any[] = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: <Detail />,
    },
    {
      value: 'cfxTransfer',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.internalTxns.title),
      url: `/rpc/trace_transaction?address=${hash}`,
      table: {
        columns: columnsCFXTrasfer,
        rowKey: (row, index) =>
          `${row.transactionHash || ''}${
            row.transactionTraceIndex || 0
          }${index}`,
      },
      pagination: false,
      tableHeader: info => tableHeader(info),
      hidden: cfxTransferAllCount < 2,
    },
    {
      value: 'logs',
      label: () => {
        return (
          <TabLabel total={eventLogCount} showTooltip={false}>
            {t(translations.transaction.logs.title)}
          </TabLabel>
        );
      },
      content: <EventLogs hash={hash}></EventLogs>,
      hidden: !eventLogCount,
    },
  ];

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
      <TabsTablePanel tabs={tabs} />
    </StyledPageWrapper>
  );
}

Transaction.defaultProps = {
  from: '',
  to: '',
  hash: '',
  cfxTransferCount: 0,
  eventLogCount: 0,
};

const StyledTipWrapper = styled.span`
  color: #94a3b6;
  display: flex;
  justify-content: space-between;
`;

const StyledCountWrapper = styled.span`
  color: #1e3de4;
`;

const StyledPageWrapper = styled.div`
  margin-bottom: 2.2857rem;
`;
