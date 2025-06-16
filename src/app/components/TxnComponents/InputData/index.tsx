import React, { useEffect, useState } from 'react';
import { isCoreContractAddress } from 'utils';
import { reqAbiByMethodId, reqContract } from 'utils/httpRequest';
import { CFX } from 'utils/constants';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Original } from './Original';
import { JsonDecode } from './JsonDecode';
import { GeneralDecode } from './GeneralDecode';
import { OptimizationDecode } from './OptimizationDecode';
import { UTF8 } from './UTF8';
import styled from 'styled-components';
import { ReactComponent as WarningIcon } from 'images/warning.svg';

interface Props {
  data: string;
  txnHash: string;
  toHash: string;
  isContractCreated: boolean;
}

export const InputData = ({
  data: originalData,
  toHash,
  txnHash,
  isContractCreated,
}: Props) => {
  const { t } = useTranslation();
  /**
   * options:
   * - original
   * - utf8
   * - json
   * - generalDecode
   * - optimizationDecode
   */

  const [dataTypeList, setDataTypeList] = useState([
    'original',
    'json',
    'utf8',
    'generalDecode',
    'optimizationDecode',
  ]);
  const [dataType, setDataType] = useState('optimizationDecode');
  const [tip, setTip] = useState('');
  const [data, setData] = useState<any>({
    originalData: originalData,
    generalDecodeData: '',
    optimizationDecodeData: '',
    utf8Data: '',
    jsonData: {},
  });

  useEffect(() => {
    const handleDecodeTxData = abi => {
      if (!abi) return null;
      try {
        let contract = CFX.Contract({
          abi: JSON.parse(abi),
          address: toHash,
          decodeByteToHex: true,
        });
        return contract.abi.decodeData(originalData);
      } catch (e) {
        console.log('decode tx data error: ', e);
        return null;
      }
    };
    const setResult = (abi, decodedBytecode) => {
      if (decodedBytecode) {
        setData(d => ({
          ...d,
          jsonData: decodedBytecode,
        }));
        setDataTypeList([
          'original',
          'json',
          'generalDecode',
          'optimizationDecode',
        ]);
        setDataType('optimizationDecode');
      } else {
        setDataTypeList(['original', 'generalDecode']);
        setDataType('generalDecode');
      }
      if (!abi && !decodedBytecode) {
        // abi not uploaded and no submitted function abi
        setTip('contract.abiNotUploaded');
      } else if (!decodedBytecode) {
        // abi uploaded, but decode failed
        setTip('contract.abiError');
      } else if (!abi) {
        // abi not uploaded, decode with submitted function abi
        setTip('contract.similarWarning');
      } else {
        // abi uploaded, decode success
        setTip('');
      }
    };
    const fn = async () => {
      try {
        if (!toHash || isContractCreated) {
          setDataTypeList(['original']);
          setDataType('original');
          setTip('');
        } else {
          const isContract = isCoreContractAddress(toHash);

          if (isContract) {
            let abiForDecode = '';
            let contractAbi = '';
            let decodedBytecode: any = null;

            const fields = [
              'address',
              'abi',
              'bytecode',
              'sourceCode',
              'typeCode',
            ];

            const resp = await reqContract({ address: toHash, fields });
            const { proxy, implementation } = resp;

            if (proxy?.proxy && implementation?.address) {
              const implementationResp = await reqContract({
                address: implementation.address,
                fields,
              });
              abiForDecode = implementationResp['abi'];
              contractAbi = abiForDecode;
              decodedBytecode = await handleDecodeTxData(abiForDecode);
              if (decodedBytecode) {
                setResult(contractAbi, decodedBytecode);
                return;
              }
            }
            abiForDecode = resp.abi;
            contractAbi = abiForDecode;
            if (!abiForDecode) {
              const methodId = originalData.slice(0, 10);
              const res = await reqAbiByMethodId(methodId);
              // decode tx data with function abi only if there is only one function
              if (res && res.list && res.list.length === 1) {
                // e.g. transfer(address,uint256)
                const fullName = res.list[0].fullName;
                // e.g. function transfer(address recipient, uint256 amount) returns (bool)
                const formatWithArg = res.list[0].formatWithArg;
                abiForDecode = JSON.stringify([
                  formatWithArg || `function ${fullName}`,
                ]);
              }
            }
            if (abiForDecode) {
              decodedBytecode = await handleDecodeTxData(abiForDecode);
            }
            setResult(contractAbi, decodedBytecode);
          } else {
            setDataTypeList(['original', 'utf8']);
            setDataType('utf8');
            setTip('');
          }
        }
      } catch (e) {
        console.log('txn input data error: ', e);
      }
    };

    fn();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalData, isContractCreated, toHash, txnHash]);

  const handleDataTypeChange = type => {
    setDataType(type);
  };

  const getBody = dataType => {
    if (dataType === 'original') {
      return <Original data={data.originalData}></Original>;
    } else if (dataType === 'utf8') {
      return <UTF8 data={data.originalData}></UTF8>;
    } else if (dataType === 'json') {
      return <JsonDecode data={data.jsonData}></JsonDecode>;
    } else if (dataType === 'generalDecode') {
      return (
        <GeneralDecode
          data={data.originalData}
          decodedData={data.jsonData}
        ></GeneralDecode>
      );
    } else if (dataType === 'optimizationDecode') {
      return (
        <OptimizationDecode
          data={data.originalData}
          decodedData={data.jsonData}
        ></OptimizationDecode>
      );
    }
  };

  return (
    <StyledInputDataWrapper>
      <Select
        value={dataType}
        onChange={handleDataTypeChange}
        disableMatchWidth
        size="small"
        className="input-data-select"
        disabled={dataTypeList.length === 1}
        width="180px"
      >
        {dataTypeList.map(dataTypeItem => {
          return (
            <Select.Option key={dataTypeItem} value={dataTypeItem}>
              {`${t(translations.transaction.select[dataTypeItem])}`}
            </Select.Option>
          );
        })}
      </Select>

      {getBody(dataType)}

      {tip ? (
        <div className="abi-warning">
          <WarningIcon />
          <span className="tip">
            <Trans i18nKey={tip}>
              ABI not uploaded. You can help improve the decoding of this
              transaction by
              <a href="/abi-verification" style={{ margin: '0 4px' }}>
                submitting function signatures
              </a>
              .
            </Trans>
          </span>
        </div>
      ) : null}
    </StyledInputDataWrapper>
  );
};

const StyledInputDataWrapper = styled.div`
  .input-data-select {
    margin-bottom: 16px;
    margin-top: 0;
  }
  .abi-warning {
    margin: 1.4286rem 0 0rem;
    display: flex;
    align-items: center;
    svg {
      width: 1rem;
      color: #9b9eac;
    }
    .tip {
      margin-left: 0.5714rem;
      font-size: 1rem;
      color: #9b9eac;
    }
  }
`;
