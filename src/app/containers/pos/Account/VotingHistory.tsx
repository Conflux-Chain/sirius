import React from 'react';
import { useParams } from 'react-router-dom';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'utils/hooks/useAge';
import { accountColunms, colunms, blockColunms } from 'utils/tableColumns/pos';

export function VotingHistory() {
  const { address } = useParams<{
    address: string;
  }>();
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/stat/list-account-vote-history?identifier=${address}&orderBy=createdAt&reverse=true`;
  const columnsWidth = [4, 3, 3, 5];

  const columns = [
    {
      ...blockColunms.blockHeight,
      key: 'block.height',
      dataIndex: ['block', 'height'],
      sorter: true,
      defaultSortOrder: 'descend' as 'descend' | 'ascend',
    },
    {
      ...colunms.posBlockHash,
      key: 'block.hash',
      dataIndex: ['block', 'hash'],
    },
    {
      ...accountColunms.votes,
      sorter: true,
      sortDirections: ['descend', 'ascend'] as Array<'descend' | 'ascend'>,
      showSorterTooltip: false,
    },
    {
      ...colunms.age(ageFormat, toggleAgeFormat),
      sorter: true,
      defaultSortOrder: 'descend' as 'descend',
      sortDirections: ['descend', 'descend', 'descend'] as Array<'descend'>,
      showSorterTooltip: false,
    },
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return <TablePanelNew url={url} columns={columns}></TablePanelNew>;
}
