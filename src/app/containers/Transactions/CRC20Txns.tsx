import React from 'react';
import { tokenColumns } from 'utils/tableColumns';
import { useAge } from '@cfxjs/sirius-next-common/dist/utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './components';
import { CFX_TOKEN_TYPES } from 'utils/constants';

interface Props {
  address: string;
}

export const CRC20Txns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/transfer?accountAddress=${address}&transferType=${CFX_TOKEN_TYPES.erc20}`;

  const columnsWidth = [3, 6, 5, 2, 3, 6, 4];
  const columns = [
    tokenColumns.txnHash,
    {
      ...tokenColumns.from,
      render(text, record, index) {
        return tokenColumns.from.render(text, record, index, false);
      },
    },
    tokenColumns.to,
    tokenColumns.fromType,
    tokenColumns.quantity,
    tokenColumns.token2, // @todo, why not use tokenColumns.token
    tokenColumns.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      address={address}
      total={total}
      listLimit={listLimit}
      showFilter={true}
      showSearch={true}
      searchOptions={{
        transactionHash: true,
        fromOrTo: true,
        epoch: true,
        rangePicker: true,
        token: true,
        button: {
          col: {
            xs: 24,
            sm: 10,
            md: 10,
            lg: 10,
            xl: 10,
          },
        },
      }}
      filterOptions={['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming']}
    />
  );

  const footer = <Footer pathname="transfer" type={CFX_TOKEN_TYPES.erc20} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
      rowKey={record =>
        `${record.transactionHash}-${record.transactionLogIndex}`
      }
    ></TablePanel>
  );
};
