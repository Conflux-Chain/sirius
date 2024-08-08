import React, { useEffect, useState } from 'react';
import { isCoreContractAddress } from 'utils';
import { reqContract } from 'utils/httpRequest';
import { CFX } from 'utils/constants';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

import { Original } from './Original';
import { JsonDecode } from './JsonDecode';
import { GeneralDecode } from './GeneralDecode';
import { OptimizationDecode } from './OptimizationDecode';
import { UTF8 } from './UTF8';
import styled from 'styled-components';

import imgWarning from 'images/warning.png';

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
    const fn = async () => {
      try {
        if (!toHash || isContractCreated) {
          setDataTypeList(['original']);
          setDataType('original');
          setTip('');
        } else {
          const isContract = isCoreContractAddress(toHash);

          if (isContract) {
            let isAbiError = false;
            let abi = '';

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
              abi = implementationResp['abi'];
            } else {
              abi = resp.abi;
            }

            try {
              let contract = CFX.Contract({
                abi: JSON.parse(abi),
                address: toHash,
                decodeByteToHex: true,
              });
              let decodedBytecode = contract.abi.decodeData(originalData);

              if (!decodedBytecode) {
                contract = CFX.Contract({
                  abi: JSON.parse(resp.abi),
                  address: toHash,
                  decodeByteToHex: true,
                });
                decodedBytecode = contract.abi.decodeData(originalData);
              }

              setData({
                ...data,
                jsonData: decodedBytecode,
              });
            } catch (e) {
              isAbiError = true;
            }

            if (abi && !isAbiError) {
              setDataTypeList([
                'original',
                'json',
                'generalDecode',
                'optimizationDecode',
              ]);
              setDataType('optimizationDecode');
              setTip('');
            }
            if (!abi) {
              setDataTypeList(['original', 'generalDecode']);
              setDataType('generalDecode');
              setTip('contract.abiNotUploaded');
            } else if (toHash !== null && isAbiError) {
              setDataTypeList(['original', 'generalDecode']);
              setDataType('generalDecode');
              setTip('contract.abiError');
            }
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
        <div className="warningContainer shown">
          <img src={imgWarning} alt="warning" className="warningImg" />
          <span className="text">{t(tip)}</span>
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
`;
