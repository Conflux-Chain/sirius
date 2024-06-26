import React from 'react';
import {
  TablePanel as TablePanelNew,
  sortDirections,
} from 'app/components/TablePanelNew';
import { colunms, committeeColunms } from 'utils/tableColumns/pos';

export function VotesDistribution({ data, loading }) {
  const columnsWidth = [4, 4, 4];
  const columns = [
    {
      ...colunms.posAddress,
      key: 'address',
      dataIndex: 'address',
    },
    {
      ...committeeColunms.votes,
      key: 'votingPower',
      dataIndex: 'votingPower',
      defaultSortOrder: sortDirections[0],
      sortDirections,
      showSorterTooltip: false,
      sorter: (a, b) => a.votingPower - b.votingPower,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="address"
    ></TablePanelNew>
  );
}
