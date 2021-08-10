import React from 'react';
import { tokenColunms, transactionColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer, TxnSwitcher } from './components';
import { isAccountAddress } from 'utils';

interface Props {
  address: string;
}

export const ExcutedTxns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = `/transaction?accountAddress=${address}`;

  const columnsWidth = [4, 3, 7, 6, 2, 3, 3, 3, 5];
  const columns = [
    transactionColunms.hash,
    transactionColunms.method,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.to,
    tokenColunms.fromType,
    transactionColunms.value,
    transactionColunms.gasPrice,
    transactionColunms.gasFee,
    transactionColunms.age(ageFormat, toggleAgeFormat),
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
        nonce: true,
        epoch: true,
        rangePicker: true,
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
      filterOptions={[
        'txTypeAll',
        'txTypeOutgoing',
        'txTypeIncoming',
        'status1',
        'txTypeCreate',
      ]}
      extraContent={
        <TxnSwitcher
          total={total}
          isAccount={isAccountAddress(address)}
        ></TxnSwitcher>
      }
    />
  );

  const footer = <Footer pathname="transaction" />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      rowKey="hash"
      footer={footer}
      title={title}
    ></TablePanel>
  );
};
