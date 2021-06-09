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
import { Card } from 'app/components/Card/Loadable';

import { SubTabs } from 'app/components/Tabs/Loadable';

const AceEditorStyle = {
  width: '100%',
};

export const ContractContent = ({ contractInfo }) => {
  const { t } = useTranslation();
  const { sourceCode, abi, address } = contractInfo;
  const [dataForRead, setDataForRead] = useState([]);
  const [dataForWrite, setDataForWrite] = useState([]);
  const [activeKey, setActiveKey] = useState('sourceCode');

  let abiJson = [];
  try {
    abiJson = JSON.parse(abi);
  } catch (error) {}
  const clickHandler = (btnType: React.SetStateAction<string>) => {
    setActiveKey(btnType);
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

  let tabs = [
    {
      key: 'sourceCode',
      label: t(translations.contract.sourceCodeShort),
    },
    {
      key: 'abi',
      label: t(translations.contract.abiShort),
    },
  ];

  if (abi) {
    tabs = tabs.concat([
      {
        key: 'read',
        label: t(translations.contract.readContract),
      },
      {
        key: 'write',
        label: t(translations.contract.writeContract),
      },
    ]);
  }

  return (
    <>
      <ContractBody>
        <SubTabs
          tabs={tabs}
          activeKey={activeKey}
          onChange={clickHandler}
          className="contract-body-subtabs"
        ></SubTabs>
        <ContractCard>
          {activeKey === 'sourceCode' && (
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
          {activeKey === 'abi' && (
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
          {activeKey === 'read' && (
            <ContractAbi
              type="read"
              data={dataForRead}
              contractAddress={address}
              contract={contract}
            ></ContractAbi>
          )}
          {activeKey === 'write' && (
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

const ContractBody = styled.div`
  padding-bottom: 3.5714rem;
  background-color: #ffffff;

  .contract-body-subtabs {
    padding: 0.5714rem 1.2857rem;
    border-bottom: 1px solid #e8e9ea;
  }
`;

const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
