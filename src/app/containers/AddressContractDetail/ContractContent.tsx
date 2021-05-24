import React, { useState, useEffect } from 'react';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { cfx } from 'utils/cfx';
import { ContractAbi } from 'app/components/ContractAbi/Loadable';
import { formatType } from 'js-conflux-sdk/src/contract/abi';
import styled from 'styled-components/macro';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-chrome';
import { Button } from '@cfxjs/react-ui';
import clsx from 'clsx';
import { Card } from 'app/components/Card/Loadable';
import { media } from 'styles/media';

const AceEditorStyle = {
  width: '100%',
};

export const ContractContent = ({ contractInfo }) => {
  const { t } = useTranslation();
  const { sourceCode, abi, address } = contractInfo;
  const [dataForRead, setDataForRead] = useState([]);
  const [dataForWrite, setDataForWrite] = useState([]);
  let abiJson = [];
  try {
    abiJson = JSON.parse(abi);
  } catch (error) {}
  const [selectedBtnType, setSelectedBtnType] = useState('sourceCode');
  const clickHandler = (btnType: React.SetStateAction<string>) => {
    setSelectedBtnType(btnType);
    if (btnType) {
      trackEvent({
        category: ScanEvent.tab.category,
        action:
          ScanEvent.tab.action[
            `contract${
              (btnType + '').charAt(0).toUpperCase() + (btnType + '').slice(1)
            }`
          ],
      });
    }
  };

  // init contract object by abi and address
  const contract = cfx.Contract({
    abi: abiJson,
    address,
  });
  useEffect(() => {
    getReadWriteData(abiJson).then(res => {
      const [dataForR, dataForW] = res;
      setDataForRead(dataForR as any);
      setDataForWrite(dataForW as any);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractInfo]);

  async function getReadWriteData(abiJson) {
    let dataForRead: object[] = [];
    let dataForWrite: object[] = [];
    let proArr: object[] = [];
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
    return [dataForRead, dataForWrite];
  }

  return (
    <>
      <ContractBody>
        <ButtonWrapper>
          <Button
            className={clsx(
              selectedBtnType === 'sourceCode' && 'enabled',
              'btnWeight',
            )}
            onClick={() => clickHandler('sourceCode')}
          >
            {t(translations.contract.sourceCodeShort)}
          </Button>
          <Button
            className={clsx(
              selectedBtnType === 'abi' && 'enabled',
              'btn-item',
              'btnWeight',
            )}
            onClick={() => clickHandler('abi')}
          >
            {t(translations.contract.abiShort)}
          </Button>
          {abi && (
            <Button
              className={clsx(
                selectedBtnType === 'read' && 'enabled',
                'btn-item',
                'btnWeight',
              )}
              onClick={() => clickHandler('read')}
            >
              {t(translations.contract.readContract)}
            </Button>
          )}
          {abi && (
            <Button
              className={clsx(
                selectedBtnType === 'write' && 'enabled',
                'btn-item',
                'btnWeight',
              )}
              onClick={() => clickHandler('write')}
            >
              {t(translations.contract.writeContract)}
            </Button>
          )}

          <div className="line"></div>
        </ButtonWrapper>
        <ContractCard>
          {selectedBtnType === 'sourceCode' && (
            <AceEditor
              readOnly
              style={AceEditorStyle}
              mode="solidity"
              theme="chrome"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                showLineNumbers: true,
              }}
              showGutter={false}
              showPrintMargin={false}
              value={sourceCode}
            />
          )}
          {selectedBtnType === 'abi' && (
            <AceEditor
              readOnly
              style={AceEditorStyle}
              mode="json"
              theme="chrome"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                showLineNumbers: true,
              }}
              showGutter={false}
              showPrintMargin={false}
              value={abi}
            />
          )}
          {selectedBtnType === 'read' && (
            <ContractAbi
              type="read"
              data={dataForRead}
              contractAddress={address}
              contract={contract}
            ></ContractAbi>
          )}
          {selectedBtnType === 'write' && (
            <ContractAbi
              type="write"
              data={dataForWrite}
              contractAddress={address}
              contract={contract}
            ></ContractAbi>
          )}
        </ContractCard>
      </ContractBody>
    </>
  );
};
const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
const ContractBody = styled.div`
  padding-bottom: 3.5714rem;
`;
const ButtonWrapper = styled.div`
  width: 100%;
  float: left;
  box-sizing: border-box;
  padding: 0 1.2857rem;
  margin: 0.5714rem 0 0 0;
  .line {
    height: 0.0714rem;
    background-color: #e8e9ea;
    margin-top: 0.5714rem;
  }
  .btn {
    color: #74798c;
    font-size: 1rem;
  }
  .btn.btnWeight {
    border-radius: 1.1429rem;
    padding: 0 1rem;
    min-width: initial;
    height: 1.8571rem;
    line-height: 1.8571rem;
    border: none;
    top: 0px;
    background-color: #f5f8ff;

    ${media.s} {
      margin: 5px 0;
    }

    &:hover {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }
    &:active {
      color: #ffffff;
      background-color: rgba(0, 84, 254, 0.8);
    }
    .text {
      top: 0px !important;
    }
  }
  .enabled.btn {
    color: #ffffff;
    background-color: rgba(0, 84, 254, 0.8);
  }

  .btn-item.btn {
    margin-left: 0.2857rem;
  }
  .hidden {
    display: none;
  }
`;
