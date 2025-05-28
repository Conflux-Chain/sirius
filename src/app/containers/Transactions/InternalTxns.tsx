import React, { useEffect, useState } from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { fetchWithPrefix } from '@cfxjs/sirius-next-common/dist/utils/request';
import { TablePanel as TablePanelNew } from 'app/components/TablePanelNew';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { CopyButton } from '@cfxjs/sirius-next-common/dist/components/CopyButton';
import { formatAddress } from 'utils';
import styled from 'styled-components';
import { publishRequestError } from '@cfxjs/sirius-next-common/dist/utils/pubsub';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { uniqueId } from 'lodash';

const treeToFlat = tree => {
  let list: Array<any> = [];

  try {
    const fn = (t, level: number, parentLevel) => {
      if (Array.isArray(t)) {
        t.map((item, index) => fn(item, index, parentLevel));
      } else {
        const index = `${parentLevel}_${level}`;

        let l = {
          index,
          type: `${t.action.callType || t.type}`,
          from: t.action.from,
          to: t.action.to,
          value: t.action.value,
          result: t.result,
          toESpaceInfo: {
            address: null,
          },
          fromESpaceInfo: {
            address: null,
          },
        };

        if (t.action.toSpace === 'evm') {
          l.toESpaceInfo = {
            address: SDK.format.hexAddress(t.action.to),
          };
        }

        if (t.action.fromSpace === 'evm') {
          l.fromESpaceInfo = {
            address: SDK.format.hexAddress(t.action.from),
          };
        }

        list.push(l);
        t.calls && fn(t.calls, level + 1, `${parentLevel}_${level}`);
      }
    };

    fn(tree, 0, '');
  } catch (e) {
    throw new Error(e);
  }

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

  useEffect(() => {
    if (address) {
      setState({
        ...state,
        loading: true,
      });
      fetchWithPrefix<any>(`/transferTree/${address}`)
        .then(resp => {
          if (resp?.traceTree) {
            try {
              const list = treeToFlat(resp.traceTree).map(l => {
                const contractInfo = resp.contractMap || {};
                return {
                  ...l,
                  fromContractInfo: contractInfo[l.from] || {},
                  toContractInfo: contractInfo[l.to] || {},
                  id: uniqueId('InternalTxns-'),
                };
              });
              setState({
                ...state,
                data: list,
                total: list.length,
              });
            } catch (e) {
              console.log('trace parse error: ', e);
              publishRequestError({ code: 60002, message: e.message }, 'code');
            }
          }
        })
        .catch(e => {
          setState({
            ...state,
            error: e,
          });
        })
        .finally(() => {
          setState(state => ({
            ...state,
            loading: false,
          }));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const columnsWidth = [3, 4, 4, 3, 3, 5];
  const columns = [
    tokenColunms.traceType,
    {
      ...tokenColunms.from,
      render: (value, row, index) =>
        tokenColunms.from.render(value, row, undefined, false),
    },
    tokenColunms.to,
    transactionColunms.value,
    tokenColunms.traceOutcome,
    tokenColunms.traceResult,
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const fromContent = (isFull = false) => (
    <span>
      <CoreAddressContainer value={from} isFull={isFull} />{' '}
      <CopyButton copyText={formatAddress(from)} />
    </span>
  );
  const toContent = (isFull = false) => (
    <span>
      <CoreAddressContainer value={to} isFull={isFull} />{' '}
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
      pagination={state.total > 20 ? {} : false}
      dataSource={data}
      loading={loading}
      title={tableHeader}
      rowKey="id"
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
