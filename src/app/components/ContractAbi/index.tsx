/**
 *
 * ContractAbi
 *
 */
import React, { useState, useEffect } from 'react';
import FuncList from './FuncList';
import { CFX } from 'utils/constants';
import { formatType } from 'js-conflux-sdk/src/contract/abi';
import { reqContract } from 'utils/httpRequest';
import styled from 'styled-components/macro';
import { useTranslation, Trans } from 'react-i18next';
import { AddressContainer } from 'app/components/AddressContainer/Loadable';
import { translations } from 'locales/i18n';

interface ContractAbiProps {
  type?: 'read' | 'write';
  address: string;
  abi?: any;
  pattern?: React.ReactNode;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ContractAbiProps>;
export declare type Props = ContractAbiProps & NativeAttrs;

type DataType = Array<Object>;

export const ContractAbi = ({
  type = 'read',
  address,
  abi,
  pattern,
}: Props) => {
  const { t } = useTranslation();
  const [data, setData] = useState<{
    read: DataType;
    write: DataType;
  }>({
    read: [],
    write: [],
  });

  const [contract, setContract] = useState(() =>
    CFX.Contract({
      abi: [],
      address,
    }),
  );

  useEffect(() => {
    const fn = async () => {
      try {
        let abiInfo = abi;

        if (!abiInfo) {
          const resp = await reqContract({
            address,
            fields: ['abi'],
          });

          abiInfo = resp.abi;
        }

        const abiJSON = JSON.parse(abiInfo);
        const contract = CFX.Contract({
          abi: abiJSON,
          address,
        });

        setContract(contract);

        const getReadWriteData = async abi => {
          let dataForRead: DataType = [];
          let dataForWrite: DataType = [];
          let proArr: DataType = [];
          if (Array.isArray(abi)) {
            for (let abiItem of abi) {
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

          return {
            read: dataForRead,
            write: dataForWrite,
          };
        };

        getReadWriteData(abiJSON).then(data => {
          setData(data);
        });
      } catch (error) {}
    };

    fn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, abi, type]);

  return (
    <div>
      {pattern ? (
        <StyledContractAbiWrapper>
          <Trans i18nKey="contract.pattern">
            <AddressContainer isLink={true} value={address} />
            {pattern}
          </Trans>
        </StyledContractAbiWrapper>
      ) : null}
      {data[type]?.length ? (
        <FuncList
          type={type}
          data={data[type]}
          contractAddress={address}
          contract={contract}
        ></FuncList>
      ) : (
        <StyledTipWrapper>
          {type === 'read'
            ? t(translations.contract.noReadContract)
            : t(translations.contract.noWriteContract)}
        </StyledTipWrapper>
      )}
    </div>
  );
};

const StyledContractAbiWrapper = styled.div`
  margin-top: 15px;
`;

const StyledTipWrapper = styled.div`
  color: #74798c;
  margin-top: 12px;
`;
