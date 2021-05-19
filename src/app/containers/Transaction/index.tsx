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
import { Tooltip } from 'app/components/Tooltip';

export function Transaction() {
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [checked, setChecked] = useState(() => {
    return queryString.parse(location.search).zeroValue === 'true';
  });
  const { hash } = useParams<{
    hash: string;
  }>();
  const [txnDetail, setTxnDetail] = useState<any>({});

  const transactionAdvanced = t(translations.transaction.internalTxns.advanced);
  const transactionSimple = t(translations.transaction.internalTxns.simple);

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
    cfxTransferCount,
    cfxTransferAllCount,
    eventLogCount,
  } = txnDetail;

  useEffect(() => {
    if (!queryString.parse(location.search).zeroValue) {
      if (cfxTransferCount) {
        setChecked(false);
      } else if (cfxTransferAllCount) {
        setChecked(true);
      }
    }
  }, [cfxTransferCount, cfxTransferAllCount, location.search]);

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

  let tableHeader = () => {
    const total = checked ? cfxTransferAllCount : cfxTransferCount;
    return (
      <StyledTipWrapper>
        <div>
          {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
          {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
          {t(translations.transaction.internalTxnsTip.produced)}{' '}
          <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
          {t(translations.transaction.internalTxnsTip.txns, {
            type: checked
              ? transactionAdvanced.toLowerCase()
              : transactionSimple.toLowerCase(),
          })}
        </div>
        <Tooltip text={t(translations.transaction.internalTxnsTip.tip)}>
          <Switch
            checked={checked}
            onChange={handleSwitch}
            checkedChildren={transactionAdvanced}
            unCheckedChildren={transactionSimple}
            style={{
              width: i18n.language.indexOf('en') > -1 ? '6.5714rem' : 'inherit',
            }}
          />
        </Tooltip>
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
      url,
      table: {
        columns: columnsCFXTrasfer,
        rowKey: (row, index) =>
          `${row.transactionHash || ''}${
            row.transactionTraceIndex || 0
          }${index}`,
      },
      tableHeader: tableHeader(),
      hidden: !cfxTransferCount && !cfxTransferAllCount,
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
