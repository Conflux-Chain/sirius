import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnsType } from 'app/components/TabsTablePanel';
import { TabsTablePanel } from 'app/components/TabsTablePanel/Loadable';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import styled from 'styled-components/macro';
import { cfxTokenTypes } from 'utils/constants';
import { EventLogs } from './EventLogs/Loadable';
import { TabLabel } from 'app/components/TabsTablePanel/Label';
import { Switch } from '@jnoodle/antd';
import { Detail } from './Detail';
import { AddressContainer } from 'app/components/AddressContainer';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils/cfx';
import { reqTransactionDetail } from 'utils/httpRequest';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from 'app/components/PageHeader/Loadable';

export function Transaction() {
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

  const { from, to, cfxTransferCount, eventLogCount } = txnDetail;

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

  const urls = useMemo(
    () => ({
      simple: `/transfer?transferType=${cfxTokenTypes.cfx}&reverse=true&transactionHash=${hash}`,
      advanced: `/transfer?transferType=${cfxTokenTypes.cfx}&reverse=true&transactionHash=${hash}&a=1`,
    }),
    [hash],
  );

  const { t, i18n } = useTranslation();
  const tipT = translations.transaction.internalTxnsTip;
  const [url, setUrl] = useState(urls.simple);
  const [checked, setChecked] = useState(false);

  const columnsCFXTransferWidth = [2, 3, 3, 2];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.traceType,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  const handleSwitch = value => {
    setChecked(value);
    if (value) {
      setUrl(urls.advanced);
    } else {
      setUrl(urls.simple);
    }
  };

  let label = (count = 0) => (
    <StyledTipWrapper>
      <div>
        {t(tipT.from)} {fromContent()} {t(tipT.to)} {toContent()}{' '}
        {t(tipT.produced)} <StyledCountWrapper>{count}</StyledCountWrapper>{' '}
        {t(tipT.txns)}
      </div>
      <Switch
        checked={checked}
        onChange={handleSwitch}
        checkedChildren={t(translations.transaction.internalTxns.advanced)}
        unCheckedChildren={t(translations.transaction.internalTxns.simple)}
        style={{
          display: 'none', // temp hide for api support
          width: i18n.language.indexOf('en') > -1 ? '6.5714rem' : 'inherit',
        }}
      />
    </StyledTipWrapper>
  );

  let tabs: any[] = [
    {
      value: 'overview',
      label: t(translations.transaction.overview),
      content: <Detail />,
    },
    {
      value: 'cfxTransfer',
      action: 'transactionCfxTransfers',
      label: () => {
        return (
          <TabLabel total={cfxTransferCount} showTooltip={false}>
            {t(translations.transaction.internalTxns.title)}
          </TabLabel>
        );
      },
      url,
      table: {
        columns: columnsCFXTrasfer,
        rowKey: (row, index) =>
          `${row.transactionHash || ''}${
            row.transactionTraceIndex || 0
          }${index}`,
      },
      tableHeader: label(cfxTransferCount),
      hidden: !cfxTransferCount,
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
