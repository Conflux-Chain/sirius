import React, { useEffect, useState } from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { fetchWithPrefix } from 'utils/request';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AddressContainer } from 'app/components/AddressContainer';
import { CopyButton } from 'app/components/CopyButton/Loadable';
import { formatAddress } from 'utils/cfx';
import styled from 'styled-components/macro';
import pubsub from 'utils/pubsub';

const treeToFlat = tree => {
  let list: Array<any> = [];

  try {
    const fn = (t, level: number, parentLevel) => {
      if (Array.isArray(t)) {
        t.map((item, index) => fn(item, index, parentLevel));
      } else {
        const index = `${parentLevel}_${level}`;
        list.push({
          index,
          type: `${t.action.callType || t.type}`,
          from: t.action.from,
          to: t.action.to,
          value: t.action.value,
          result: t.result,
        });
        fn(t.calls, level + 1, `${parentLevel}_${level}`);
      }
    };

    fn(tree, 0, '');
  } catch (e) {}

  return list;
};

interface Props {
  address: string;
  from: string;
  to: string;
}

export const InternalTxns = ({ address, from, to }: Props) => {
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
  const url = `/rpc/trace_transaction?address=${address}`;

  useEffect(() => {
    if (address) {
      setState({
        ...state,
        loading: true,
      });
      fetchWithPrefix(`/transferTree/${address}`)
        .then(resp => {
          if (resp) {
            try {
              const list = treeToFlat(resp.calls);
              setState({
                ...state,
                data: list,
                total: list.length,
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
  }, [url]);

  const columnsWidth = [3, 4, 4, 2, 4];
  const columns = [
    tokenColunms.traceType,
    tokenColunms.from,
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.traceResult,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

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

  const { data, total, loading } = state;

  const tableHeader = () => {
    return (
      <StyledTipWrapper>
        <div>
          {t(translations.transaction.internalTxnsTip.from)} {fromContent()}{' '}
          {t(translations.transaction.internalTxnsTip.to)} {toContent()}{' '}
          {t(translations.transaction.internalTxnsTip.produced)}{' '}
          <StyledCountWrapper>{total}</StyledCountWrapper>{' '}
          {t(translations.transaction.internalTxnsTip.txns)}
        </div>
      </StyledTipWrapper>
    );
  };

  return (
    <TablePanelNew
      columns={columns}
      pagination={false}
      dataSource={data}
      loading={loading}
      title={tableHeader}
    ></TablePanelNew>
  );
};

const StyledTipWrapper = styled.span`
  color: #94a3b6;
  display: flex;
  justify-content: space-between;
`;

const StyledCountWrapper = styled.span`
  color: #1e3de4;
`;
