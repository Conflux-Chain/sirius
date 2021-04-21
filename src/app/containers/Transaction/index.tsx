import React, { useState, useEffect } from 'react';
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
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';

export function Transaction() {
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState(() => {
    const { zeroValue } = queryString.parse(location.search);
    return zeroValue === 'true';
  });
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

  const url = `/transfer?transferType=${
    cfxTokenTypes.cfx
  }&reverse=true&transactionHash=${hash}${checked ? '&zeroValue=true' : ''}`;

  const columnsCFXTransferWidth = [2, 3, 3, 2];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.traceType,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  const handleSwitch = value => {
    setChecked(value);
    const { zeroValue, ...others } = queryString.parse(location.search);
    let newUrl = '';
    if (value) {
      newUrl = queryString.stringifyUrl({
        url: location.pathname,
        query: {
          ...others,
          zeroValue: 'true',
        },
      });
    } else {
      newUrl = queryString.stringifyUrl({
        url: location.pathname,
        query: {
          ...others,
        },
      });
    }
    history.push(newUrl);
  };

  let tableHeader = (total = 0) => (
    <StyledTipWrapper>
      <div>
        {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
        {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
        {t(translations.transaction.internalTxnsTip.produced)}{' '}
        <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
        {t(translations.transaction.internalTxnsTip.txns)}
      </div>
      <Switch
        checked={checked}
        onChange={handleSwitch}
        checkedChildren={t(translations.transaction.internalTxns.advanced)}
        unCheckedChildren={t(translations.transaction.internalTxns.simple)}
        style={{
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
      label: (total, _, item) => {
        // it is not good, but if use useState to update will cause warning:
        // Warning: Cannot update a component from inside the function body of a different component.
        item.tableHeader = tableHeader(total);
        return (
          <TabLabel total={total || cfxTransferCount} showTooltip={false}>
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
      tableHeader: tableHeader(cfxTransferCount),
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
      <TabsTablePanel tabs={tabs} key={url} />
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
