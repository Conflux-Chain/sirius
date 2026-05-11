import React, { useState, useMemo } from 'react';
import {
  tokenColunms,
  transactionColunms,
  traceColumns,
} from 'utils/tableColumns';
import styled from 'styled-components';
import { TraceDetail } from '@cfxjs/sirius-next-common/dist/components/TransactionTrace';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import {
  ListTraceForUI,
  treeTraceToList,
} from '@cfxjs/sirius-next-common/dist/utils/hooks/useTxTrace';

export const ListTrace = ({
  data,
  loading,
  showProxyCall,
}: {
  data: ListTraceForUI[];
  loading?: boolean;
  showProxyCall?: boolean;
}) => {
  const [expandedRowKeys, setExpandedKeys] = useState<string[]>([]);
  const list = useMemo(() => {
    return treeTraceToList(data, showProxyCall);
  }, [data, showProxyCall]);

  const columnsWidth = [3, 2, 5, 5, 2, 3, 1];
  const columns = [
    traceColumns.traceType(),
    transactionColunms.method,

    {
      ...tokenColunms.from,
      render: (value, row) =>
        tokenColunms.from.render(value, row, undefined, false),
    },
    tokenColunms.to,
    transactionColunms.value,
    traceColumns.gas,
    traceColumns.detailExpandColumn({
      expandedRowKeys: expandedRowKeys,
      setExpandedKeys: setExpandedKeys,
    }),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  return (
    <StyledContainer>
      <TablePanelNew
        columns={columns}
        pagination={list.length > 10 ? {} : false}
        dataSource={list}
        loading={loading}
        rowKey="index"
        hideDefaultTitle
        hideShadow
        expandable={{
          expandedRowKeys,
          expandedRowRender: (
            record: ListTraceForUI,
            index,
            indent,
            expanded,
          ) => {
            if (!expanded) return null;
            const isDetailedExpanded = expandedRowKeys.includes(record.index);
            return (
              <div>
                {isDetailedExpanded && (
                  <TraceDetail
                    abi={record.abi}
                    input={record.input}
                    output={record.result?.returnData}
                    to={record.to}
                    outcome={record.result?.outcome}
                    isContractCreated={!!record.contractCreated}
                    space="core"
                    proxy={record.proxy}
                  />
                )}
              </div>
            );
          },
          columnWidth: 0,
        }}
      ></TablePanelNew>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  .ant-table-row-expand-icon-cell {
    width: 0;
  }
`;
