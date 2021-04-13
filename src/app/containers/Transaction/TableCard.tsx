import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { useTabTableData } from '../../components/TabsTablePanel/useTabTableData';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import styled from 'styled-components/macro';
import { cfxTokenTypes } from 'utils/constants';
import { EventLogs } from './EventLogs/Loadable';
import { TabLabel } from 'app/components/TabsTablePanel/Label';

export function TableCard({
  from,
  to,
  hash,
}: {
  from: React.ReactNode;
  to: React.ReactNode;
  hash: string;
}) {
  const [eventlogsTotalCount, setEventlogsTotalCount] = useState(0);
  const { t } = useTranslation();
  const tipT = translations.transaction.internalTxnsTip;

  const columnsCFXTransferWidth = [2, 3, 3, 2];
  const columnsCFXTrasfer: ColumnsType = [
    tokenColunms.traceType,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
  ].map((item, i) => ({ ...item, width: columnsCFXTransferWidth[i] }));

  let label = (count = 0) => (
    <StyledTipWrapper>
      {t(tipT.from)} {from} {t(tipT.to)} {to} {t(tipT.produced)}{' '}
      <StyledCountWrapper>{count}</StyledCountWrapper> {t(tipT.txns)}
    </StyledTipWrapper>
  );

  const handleEventlogsChange = (total: number) => {
    setEventlogsTotalCount(total);
  };

  const tabs = [
    {
      value: 'cfxTransfer',
      action: 'transactionCfxTransfers',
      label: t(translations.transaction.internalTxns),
      url: `/transfer?transferType=${cfxTokenTypes.cfx}&reverse=true&transactionHash=${hash}`,
      table: {
        columns: columnsCFXTrasfer,
        rowKey: (row, index) =>
          `${row.transactionHash || ''}${
            row.transactionTraceIndex || 0
          }${index}`,
      },
      tableHeader: label(0),
    },
    {
      value: 'logs',
      label: () => {
        return (
          <TabLabel total={eventlogsTotalCount} showTooltip={false}>
            {t(translations.transaction.logs.title)}
          </TabLabel>
        );
      },
      content: (
        <EventLogs hash={hash} onChange={handleEventlogsChange}></EventLogs>
      ),
    },
  ];

  const { currentTabTotal } = useTabTableData(tabs);

  tabs[0].tableHeader = label(currentTabTotal);

  return (
    <StyledPageWrapper>
      <TabsTablePanel tabs={tabs} />
    </StyledPageWrapper>
  );
}

const StyledPageWrapper = styled.div`
  margin-top: 1.4286rem;
`;

const StyledTipWrapper = styled.span`
  color: #94a3b6;
`;

const StyledCountWrapper = styled.span`
  color: #1e3de4;
`;
