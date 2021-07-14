import React from 'react';
import { tokenColunms } from 'utils/tableColumns';
import { useAge } from 'utils/hooks/useAge';
import { TablePanel } from 'app/components/TablePanelNew';
import { Title, Footer } from './Common';
import { cfxTokenTypes } from 'utils/constants';

interface Props {
  address: string;
}

export const CRC20Txns = ({ address }: Props) => {
  const [ageFormat, toggleAgeFormat] = useAge();

  const url = `/transfer?accountAddress=${address}&transferType=${cfxTokenTypes.erc20}`;

  const columnsWidth = [3, 6, 5, 3, 6, 4];
  const columns = [
    tokenColunms.txnHash,
    tokenColunms.from,
    tokenColunms.to,
    tokenColunms.quantity,
    tokenColunms.token2, // @todo, why not use tokenColunms.token
    tokenColunms.age(ageFormat, toggleAgeFormat),
  ].map((item, i) => ({ ...item, width: columnsWidth[i] }));

  const title = ({ total }) => (
    <Title address={address} total={total} showDatepicker={true} />
  );

  const footer = <Footer pathname="transfer" type={cfxTokenTypes.erc20} />;

  return (
    <TablePanel
      url={url}
      columns={columns}
      footer={footer}
      title={title}
    ></TablePanel>
  );
};
