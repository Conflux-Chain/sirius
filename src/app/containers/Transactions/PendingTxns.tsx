import React, { useEffect, useState } from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useTranslation } from 'react-i18next';
import pubsub from 'utils/pubsub';
import { cfx } from 'utils/cfx';
import { format } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { translations } from 'locales/i18n';
import BigNumber from 'bignumber.js';
import { toThousands } from 'utils';

interface Props {
  address: string;
}

export const PendingTxns = ({ address }: Props) => {
  const { t } = useTranslation();
  const [state, setState] = useState<{
    total: number;
    data: any;
    error: any;
    loading: boolean;
  }>({
    total: 0,
    data: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (address) {
      setState({
        ...state,
        loading: true,
      });
      cfx
        .getAccountPendingTransactions(
          address,
          undefined,
          format.hex(10), // default limit
        )
        .then(resp => {
          if (resp) {
            try {
              const { firstTxStatus, pendingCount, pendingTransactions } = resp;
              const list = pendingTransactions.slice(0, 10).map((p, index) => {
                p.status = '4';
                if (!index) {
                  p.reason = firstTxStatus;
                }
                return p;
              });

              setState({
                ...state,
                data: list,
                total: new BigNumber(pendingCount).toNumber(),
                loading: false,
              });
            } catch (e) {}
          }
        })
        .catch(e => {
          setState({
            ...state,
            error: e,
          });
          pubsub.publish('notify', {
            type: 'request',
            option: {
              code: '30001', // rpc call error
              message: e.message,
            },
          });
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const columnsWidth = [4, 6, 5, 3, 2, 3, 5];
  const columns = [
    transactionColunms.hash,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    transactionColunms.gasPrice,
    {
      ...transactionColunms.gasFee,
      render: () => t(translations.transactions.pendingTxnGasFee),
    },
    transactionColunms.pendingReason,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const { data, total, loading } = state;

  const tableHeader = () => {
    return (
      <div>
        {total > 10
          ? t(translations.transactions.pendingTotal, {
              total: toThousands(total),
            })
          : t(translations.general.totalRecord, {
              total: toThousands(total),
            })}
      </div>
    );
  };

  return (
    <TablePanelNew
      columns={columns}
      pagination={false}
      dataSource={data}
      loading={loading}
      title={tableHeader}
      rowKey="hash"
    ></TablePanelNew>
  );
};
