import React from 'react';
import { useParams } from 'react-router-dom';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useAge } from 'sirius-next/packages/common/dist/utils/hooks/useAge';
import { accountColunms, colunms } from 'utils/tableColumns/pos';

export function IncomingHistory() {
  const { address } = useParams<{
    address: string;
  }>();
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/stat/list-pos-account-reward?identifier=${address}&orderBy=createdAt&reverse=true`;
  const columnsWidth = [3, 3, 5];

  const columns = [
    colunms.powBlockHash,
    {
      ...accountColunms.incoming,
      sorter: true,
      sortDirections: ['descend', 'ascend', 'descend'] as Array<
        'descend' | 'ascend'
      >,
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
