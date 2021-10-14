/**
 *
 * ContractAbi
 *
 */
import React, { useState, useMemo, useEffect } from 'react';
import FuncList from './FuncList';
import { CFX } from 'utils/constants';
import { formatType } from 'js-conflux-sdk/src/contract/abi';
interface ContractAbiProps {
  type?: 'read' | 'write';
  address: string;
  abi?: any;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ContractAbiProps>;
export declare type Props = ContractAbiProps & NativeAttrs;

type DataType = Array<Object>;

export const ContractAbi = ({ type = 'read', address, abi }: Props) => {
  const [data, setData] = useState<{
    read: DataType;
    write: DataType;
  }>({
    read: [],
    write: [],
  });

  const abiJson = useMemo(() => {
    try {
      return JSON.parse(abi);
    } catch (error) {
      return [];
    }
  }, [abi]);

  const contract = useMemo(() => {
    return CFX.Contract({
      abi: abiJson,
      address,
    });
  }, [abiJson, address]);

  const getReadWriteData = async abiJson => {
    let dataForRead: DataType = [];
    let dataForWrite: DataType = [];
    let proArr: DataType = [];
    if (Array.isArray(abiJson)) {
      for (let abiItem of abiJson) {
        if (abiItem.name !== '' && abiItem.type === 'function') {
          const stateMutability = abiItem.stateMutability;
          switch (stateMutability) {
            case 'pure':
            case 'view':
              if (abiItem.inputs && abiItem.inputs.length === 0) {
                const fullNameWithType = formatType({
                  name: abiItem['name'],
                  inputs: abiItem['inputs'],
                });
                proArr.push(contract[fullNameWithType]());
              }
              dataForRead.push(abiItem);
              break;
            case 'nonpayable':
              dataForWrite.push(abiItem);
              break;
            case 'payable':
              const payableObjs = [
                {
                  internalType: 'cfx',
                  name: abiItem['name'],
                  type: 'cfx',
                },
              ];
              abiItem['inputs'] = payableObjs.concat(abiItem['inputs']);
              dataForWrite.push(abiItem);
              break;
            default:
              break;
          }
        }
      }
      const list = await Promise.allSettled(proArr);
      let i = 0;
      dataForRead.forEach(function (dValue, dIndex) {
        if (dValue['inputs'].length === 0) {
          const listItem = list[i];
          const status = listItem['status'];
          if (status === 'fulfilled') {
            const val = listItem['value'];
            if (dValue['outputs'].length > 1) {
              dValue['value'] = val;
            } else {
              const arr: any = [];
              arr.push(val);
              dValue['value'] = arr;
            }
          } else {
            dValue['error'] = listItem['reason']['message'];
          }
          ++i;
        }
      });
    }
    // return [dataForRead, dataForWrite];
    return {
      read: dataForRead,
      write: dataForWrite,
    };
  };

  useEffect(() => {
    getReadWriteData(abiJson).then(data => {
      setData(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abiJson, address]);

  return (
    <FuncList
      type={type}
      data={data[type]}
      contractAddress={address}
      contract={contract}
    ></FuncList>
  );
};
