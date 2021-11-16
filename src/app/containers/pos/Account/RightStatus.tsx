import React, { useState, useEffect } from 'react';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { committeeColunms } from 'utils/tableColumns/pos';
import { useParams } from 'react-router-dom';
import { getPosAccountInfo } from 'utils/rpcRequest';

type QueueType = Array<{
  endBlockNumber: number;
  power: number;
  type?: 'in' | 'out';
}>;

export function RightStatus() {
  const { address } = useParams<{
    address: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QueueType>([]);

  useEffect(() => {
    setLoading(true);

    getPosAccountInfo(address).then(resp => {
      let arr: QueueType = [];

      if (resp.status?.inQueue?.length) {
        arr = arr.concat(
          resp.status.inQueue.map(i => ({
            ...i,
            type: 'in',
          })),
        );
      }

      if (resp.status?.outQueue?.length) {
        arr = arr.concat(
          resp.status.inQueue.map(i => ({
            ...i,
            type: 'out',
          })),
        );
      }

      setData(arr);
      setLoading(false);
    });
  }, [address]);

  const columnsWidth = [3, 2, 4];
  const columns = [
    committeeColunms.rightStatus,
    committeeColunms.right,
    committeeColunms.deadline,
  ].map((item, i) => ({
    ...item,
    width: columnsWidth[i],
  }));

  return (
    <TablePanelNew
      columns={columns}
      dataSource={data}
      loading={loading}
    ></TablePanelNew>
  );
}
