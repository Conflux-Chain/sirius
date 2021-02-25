import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { ColumnsType } from '../../components/TabsTablePanel';
import { TabsTablePanel } from '../../components/TabsTablePanel/Loadable';
import { useTabTableData } from '../../components/TabsTablePanel/useTabTableData';
import { tokenColunms, transactionColunms } from '../../../utils/tableColumns';
import styled from 'styled-components/macro';
import { cfxTokenTypes } from '../../../utils/constants';

export function TableCard({
  from,
  to,
}: {
  from?: React.ReactNode;
  to?: React.ReactNode;
}) {
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

  const tabs = [
    {
      value: 'cfxTransfer',
      label: t(translations.transaction.internalTxns),
      url: `/transfer?transferType=${cfxTokenTypes.cfx}&reverse=true&transactionHash=0x3fd584bc8ea8a5ab82fc5b8106b821b6b4447d624d927be69039141d3778d5ec`,
      table: {
        columns: columnsCFXTrasfer,
        rowKey: 'address',
      },
      tableHeader: label(0),
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
