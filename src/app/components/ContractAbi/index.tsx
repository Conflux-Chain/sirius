/**
 *
 * ContractAbi
 *
 */
import React from 'react';
import FuncList from './FuncList';
interface ContractAbiProps {
  type?: string;
  data?: object[];
  contractAddress: string;
  contract: object;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ContractAbiProps>;
export declare type Props = ContractAbiProps & NativeAttrs;

export const ContractAbi = ({
  type,
  data,
  contractAddress,
  contract,
}: Props) => {
  return (
    <>
      <FuncList
        type={type}
        data={data}
        contractAddress={contractAddress}
        contract={contract}
      ></FuncList>
    </>
  );
};
