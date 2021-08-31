import React from 'react';
import {
  tokenColunms,
  transactionColunms,
  blockColunms,
} from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './components';
import { cfxTokenTypes } from 'utils/constants';

interface Props {
  address: string;
}

export const CFXTxns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();
  const url = `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.cfx}`;

  const columnsWidth = [4, 4, 8, 7, 2, 4, 5];
  const columns = [
    tokenColunms.txnHash,
    blockColunms.epoch,
    {
      ...tokenColunms.from,
      render(text, record, index) {
        return tokenColunms.from.render(text, record, index, false);
      },
    },
    tokenColunms.to,
    tokenColunms.fromType,
    transactionColunms.value,
    tokenColunms.age(ageFormat, toggleAgeFormat),
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
        button: {
          col: {
            xs: 24,
            sm: 18,
            md: 18,
            lg: 18,
            xl: 18,
          },
        },
      }}
      filterOptions={['txTypeAll', 'txTypeOutgoing', 'txTypeIncoming']}
    />
  );

  const footer = <Footer pathname="transfer" type={cfxTokenTypes.cfx} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
    ></TablePanel>
  );
};
