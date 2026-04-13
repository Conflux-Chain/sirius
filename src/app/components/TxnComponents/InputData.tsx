import React from 'react';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import { InputData as InputDataBody } from '@cfxjs/sirius-next-common/dist/components/InputData';
import {
  useDecodeFunctionData,
  Hex,
} from '@cfxjs/sirius-next-common/dist/utils/hooks/useDecodeFunctionData';
import { useDecodedDataType } from '@cfxjs/sirius-next-common/dist/utils/hooks/useDecodedDataType';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';

import styled from 'styled-components';
import { ReactComponent as WarningIcon } from 'images/warning.svg';

interface Props {
  data: Hex;
  toHash: string;
  isContractCreated: boolean;
}

export const InputData = ({
  data: originalData,
  toHash,
  isContractCreated,
}: Props) => {
  const { t } = useTranslation();
  const [decodedData] = useDecodeFunctionData({
    to: toHash,
    input: originalData,
    space: 'core',
    supportMethodAbi: true,
  });
  const { dataType, setDataType, dataTypeList, tip } = useDecodedDataType({
    to: toHash,
    input: originalData,
    isContractCreated,
    decodedData,
  });

  return (
    <StyledInputDataWrapper>
      <Select
        value={dataType}
        onChange={setDataType}
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

      <InputDataBody
        dataType={dataType}
        input={originalData}
        decodedData={decodedData}
        space="core"
      />

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
