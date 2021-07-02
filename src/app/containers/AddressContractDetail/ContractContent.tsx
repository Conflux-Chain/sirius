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
import 'ace-builds/src-noconflict/theme-tomorrow';
import { Card } from 'app/components/Card/Loadable';
import { cfxAddress } from 'utils/cfx';
import { Link } from 'app/components/Link/Loadable';

import CheckCircle from '@zeit-ui/react-icons/checkCircle';

import { SubTabs } from 'app/components/Tabs/Loadable';

const AceEditorStyle = {
  width: '100%',
  backgroundColor: '#F8F9FB',
};

const Code = ({ contractInfo }) => {
  const { t } = useTranslation();
  const { sourceCode, abi, address } = contractInfo;
  const isVerified = false;

  return (
    <StyledContractContentCodeWrapper>
      {isVerified ? (
        <>
          <div className="contract-code-verified">
            {t(translations.contract.verify.contractCodeVerified)}{' '}
            <CheckCircle size={16} color="#7cd77b" />
          </div>
          <div className="contract-code-verify-info">
            <div className="verify-info-item">
              <span className="verify-info-title">
                {t(translations.contract.verify.contractName)}
              </span>
              <span className="verify-info-content">xxx</span>
            </div>
            <div className="verify-info-item">
              <span className="verify-info-title">
                {t(translations.contract.verify.compilerVersion)}
              </span>
              <span className="verify-info-content">xxx</span>
            </div>
            <div className="verify-info-item">
              <span className="verify-info-title">
                {t(translations.contract.verify.optimizationEnabled)}
              </span>
              <span className="verify-info-content">
                {t(translations.contract.verify.runs, {
                  count: 0,
                  status: 'no',
                })}
              </span>
            </div>
            <div className="verify-info-item">
              <span className="verify-info-title">
                {t(translations.contract.verify.otherSettings)}
              </span>
              <span className="verify-info-content">xxxxxxx</span>
            </div>
          </div>
        </>
      ) : (
        <div className="contract-code-verified contract-verify-tip">
          {t(translations.contract.verify.tipLeft)}
          <Link
            href={`/contract-verification?address=${cfxAddress.simplifyCfxAddress(
              address,
            )}`}
          >
            {t(translations.contract.verify.tipCenter)}
          </Link>
          {t(translations.contract.verify.tipRight)}
        </div>
      )}
      <div className="contract-sourcecode-and-abi">
        <div className="contract-sourcecode">
          <div className="contract-sourcecode-and-abi-title">
            {t(translations.contract.sourceCodeShort)}
          </div>
          {sourceCode ? (
            <AceEditor
              readOnly
              style={AceEditorStyle}
              mode="solidity"
              theme="tomorrow"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                showLineNumbers: true,
              }}
              value={sourceCode}
              wrapEnabled={true}
              height="28rem"
              fontSize="1rem"
              showGutter={false}
              showPrintMargin={false}
            />
          ) : null}
        </div>
        <div className="contract-abi">
          <div className="contract-sourcecode-and-abi-title">
            {t(translations.contract.abi)}
          </div>
          {abi ? (
            <AceEditor
              value={abi}
              readOnly
              style={AceEditorStyle}
              mode="json"
              theme="tomorrow"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                showLineNumbers: true,
              }}
              height="28rem"
              wrapEnabled={true}
              fontSize="1rem"
              showGutter={false}
              showPrintMargin={false}
            />
          ) : null}
        </div>
      </div>
    </StyledContractContentCodeWrapper>
  );
};

const StyledContractContentCodeWrapper = styled.div`
  .contract-code-verified {
    font-size: 16px;
    font-weight: bold;
    color: #0f1327;
    line-height: 22px;
    margin: 15px 0;
  }

  .contract-code-verify-info {
    display: flex;
    flex-flow: wrap;
    border-bottom: 1px solid #ebeced;
    padding-bottom: 12px;

    .verify-info-item {
      flex-shrink: 0;
      flex-grow: 1;
      min-width: 260px;
    }
  }

  .verify-info-title {
    font-size: 14px;
    color: #74798c;
    line-height: 22px;
  }

  .verify-info-content {
    font-size: 14px;
    color: #0f1327;
    line-height: 22px;
  }

  .contract-sourcecode-and-abi-title {
    font-size: 16px;
    font-weight: bold;
    color: #74798c;
    line-height: 22px;
    margin: 12px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .contract-sourcecode-fullscreen {
      cursor: pointer;
    }
  }
`;

export const ContractContent = ({ contractInfo }) => {
  const { t } = useTranslation();
  const { abi, address } = contractInfo;
  const [dataForRead, setDataForRead] = useState([]);
  const [dataForWrite, setDataForWrite] = useState([]);
  const [activeKey, setActiveKey] = useState('code');

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
      key: 'code',
      label: t(translations.contract.code),
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
          {activeKey === 'code' && <Code contractInfo={contractInfo} />}
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
  background-color: #ffffff;

  .contract-body-subtabs {
    padding: 0.5714rem 1.2857rem;
    border-bottom: 1px solid #e8e9ea;
  }
`;

const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
