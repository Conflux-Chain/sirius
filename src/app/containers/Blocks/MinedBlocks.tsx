import React from 'react';
import { blockColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
// import { Title /*Footer*/ } from '../Transactions/components/index';
// import { cfxTokenTypes } from 'utils/constants';
import { AddressContainer } from 'app/components/AddressContainer/Loadable';
import { Title } from 'app/containers/Transactions/components';

interface Props {
  address: string;
}

export const MinedBlocks = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = `/block?miner=${address}`;

  const columnsWidth = [3, 2, 2, 5, 6, 3, 5, 3, 5];
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
      showSearch={true}
      searchOptions={{
        blockHash: {
          col: {
            xs: 24,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          },
        },
        epoch: true,
        rangePicker: {
          col: {
            xs: 24,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          },
        },
        button: {
          col: {
            xs: 24,
            sm: 6,
            md: 6,
            lg: 6,
            xl: 6,
          },
        },
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
