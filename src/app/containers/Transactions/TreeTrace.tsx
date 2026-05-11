import React, { useState, useEffect, useMemo } from 'react';
import {
  tokenColunms,
  transactionColunms,
  traceColumns,
} from 'utils/tableColumns';
import styled from 'styled-components';
import { TreeTraceTable } from '@cfxjs/sirius-next-common/dist/components/TransactionTrace';
import {
  TreeTraceForUI,
  hideProxyCallInTreeTrace,
} from '@cfxjs/sirius-next-common/dist/utils/hooks/useTxTrace';

export const TreeTrace = ({
  data,
  loading,
  showProxyCall,
}: {
  data: TreeTraceForUI[];
  loading?: boolean;
  showProxyCall?: boolean;
}) => {
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<string[]>([]);
  const [detailExpandedKeys, setDetailExpandedKeys] = useState<string[]>([]);
  const list = useMemo(() => {
    return showProxyCall ? data : hideProxyCallInTreeTrace(data);
  }, [data, showProxyCall]);

  const columnsWidth = [150, 150, 140, 280, 280, 120, 150, 50];
  const columns = [
    traceColumns.index({
      expandedRowKeys: treeExpandedKeys,
      setExpandedKeys: setTreeExpandedKeys,
    }),
    traceColumns.traceType({ withIndex: false }),
    transactionColunms.method,

    {
      ...tokenColunms.from,
      render: (value, row, index) =>
        tokenColunms.from.render(value, row, undefined, false),
    },
    tokenColunms.to,
    transactionColunms.value,
    traceColumns.gas,
    traceColumns.detailExpandColumn({
      expandedRowKeys: detailExpandedKeys,
      setExpandedKeys: setDetailExpandedKeys,
    }),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));
  useEffect(() => {
    if (list && list.length > 0) {
      setTreeExpandedKeys(
        list.filter(d => d.calls && d.calls.length > 0).map(d => d.index),
      );
    }
  }, [list]);
  return (
    <StyledContainer>
      <TreeTraceTable
        data={list}
        loading={loading}
        columns={columns}
        treeExpandedKeys={treeExpandedKeys}
        detailExpandedKeys={detailExpandedKeys}
        space="core"
      />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  .ant-table-expanded-row > .ant-table-cell {
    padding: 0 !important;
  }
`;
