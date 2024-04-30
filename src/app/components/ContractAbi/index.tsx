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
import styled from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import { AddressContainer } from 'sirius-next/packages/common/dist/components/AddressContainer';
import { translations } from 'locales/i18n';
import { Spin } from 'sirius-next/packages/common/dist/components/Spin';
import { publishRequestError } from 'utils';

interface ContractAbiProps {
  type?: 'read' | 'write';
  address: string;
  abi?: any;
  pattern?: React.ReactNode;
  proxyAddress?: string;
}
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof ContractAbiProps>;
export declare type Props = ContractAbiProps & NativeAttrs;

type DataType = Array<Object>;

export const ContractAbi = ({
  type = 'read',
  address,
  abi,
  pattern,
  proxyAddress,
}: Props) => {
  const { t } = useTranslation();
  const [data, setData] = useState<{
    read: DataType;
    write: DataType;
  }>({
    read: [],
    write: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [contract, setContract] = useState(() =>
    CFX.Contract({
      abi: [],
      address: proxyAddress || address,
    }),
  );

  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      setError('');
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
          address: proxyAddress || address,
        });
        setContract(contract);

        const batcher = CFX.BatchRequest();
        const getReadWriteData = async abi => {
          let dataForRead: DataType = [];
          let dataForWrite: DataType = [];
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
                      batcher.add(contract[fullNameWithType]().request());
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

            const batchResult = await batcher.execute();
            let i = 0;

            dataForRead.forEach(function (dValue) {
              if (dValue['inputs'].length === 0) {
                const r = batchResult[i];
                if (r['code']) {
                  dValue['error'] = r['message'];
                } else {
                  const val = r;
                  if (dValue['outputs'].length > 1) {
                    dValue['value'] = val;
                  } else {
                    const arr: any = [];
                    arr.push(val);
                    dValue['value'] = arr;
                  }
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

        const data = await getReadWriteData(abiJSON);
        setData(data);
      } catch (error) {
        setError(error.message);
        publishRequestError(error, 'code');
      }
      setLoading(false);
    };

    fn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, abi, type]);

  return (
    <div>
      {pattern ? (
        <StyledContractAbiWrapper>
          <Trans i18nKey="contract.pattern">
            <AddressContainer link={true} value={address} />
            {pattern}
          </Trans>
        </StyledContractAbiWrapper>
      ) : null}
      {loading ? (
        <Spin spinning={loading} style={{ marginTop: '20px' }}></Spin>
      ) : error ? (
        <StyledTipWrapper>Error: {error}</StyledTipWrapper>
      ) : data[type]?.length ? (
        <FuncList
          type={type}
          data={data[type]}
          contractAddress={proxyAddress || address}
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
