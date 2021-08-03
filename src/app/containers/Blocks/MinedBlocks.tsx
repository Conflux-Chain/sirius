import React from 'react';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title /*Footer*/ } from '../Transactions/Common';
// import { cfxTokenTypes } from 'utils/constants';
import { AddressContainer } from 'app/components/AddressContainer/Loadable';

interface Props {
  address: string;
}

export const MinedBlocks = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = `/block?miner=${address}`;

  const columnsWidth = [4, 2, 2, 4, 6, 3, 5, 3, 5];
  const columns = [
    blockColunms.epoch,
    blockColunms.position,
    blockColunms.txns,
    blockColunms.hashWithPivot,
    {
      ...blockColunms.miner,
      render: value => <AddressContainer isLink={false} value={value} />,
    },
    blockColunms.avgGasPrice,
    blockColunms.gasUsedPercentWithProgress,
    blockColunms.reward,
    blockColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total, listLimit }) => (
    <Title
      address={address}
      total={total}
      listLimit={listLimit}
      showDatepicker={true}
      showSearchInput={true}
      searchInputOptions={{
        type: 'minedBlock',
        addressType: 'user',
        inputFields: ['epoch', 'blockHash'],
      }}
    />
  );

  // const footer = <Footer pathname="transfer" type={cfxTokenTypes.erc20} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      // footer={footer}
      title={title}
      rowKey="hash"
    ></TablePanel>
  );
};
