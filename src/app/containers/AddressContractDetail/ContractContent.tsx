import React, { useState } from 'react';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContractAbi } from 'app/components/ContractAbi/Loadable';
import styled from 'styled-components/macro';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { Card } from 'app/components/Card/Loadable';
import { Link } from 'app/components/Link/Loadable';
import clsx from 'clsx';
import { Row, Col } from '@jnoodle/antd';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

import CheckCircle from '@zeit-ui/react-icons/checkCircle';

import { SubTabs } from 'app/components/Tabs/Loadable';

const AceEditorStyle = {
  width: '100%',
  backgroundColor: '#F8F9FB',
};

export const CheckCircleIcon = () => <CheckCircle size={16} color="#7cd77b" />;

const Code = ({ contractInfo }) => {
  const { t } = useTranslation();
  const { sourceCode, abi, address, verify = {} } = contractInfo;
  const { exactMatch, license, name, optimization, runs, version } = verify;

  return (
    <StyledContractContentCodeWrapper>
      {exactMatch ? (
        <>
          <div className="contract-code-verified">
            {t(translations.contract.verify.contractCodeVerified)}{' '}
            <CheckCircleIcon />
          </div>
          <Row className="contract-code-verify-info">
            <Col span={6} sm={12} xs={24}>
              <span className="verify-info-title">
                {t(translations.contract.verify.contractName)}
              </span>
              <span className="verify-info-content">{name}</span>
            </Col>
            <Col span={6} sm={12} xs={24}>
              <span className="verify-info-title">
                {t(translations.contract.verify.compilerVersion)}
              </span>
              <span className="verify-info-content">{version}</span>
            </Col>
            <Col span={6} sm={12} xs={24}>
              <span className="verify-info-title">
                {t(translations.contract.verify.optimizationEnabled)}
              </span>
              <span className="verify-info-content">
                {t(translations.contract.verify.runs, {
                  count: runs,
                  status: optimization ? 'yes' : 'no',
                })}
              </span>
            </Col>
            <Col span={6} sm={12} xs={24}>
              <span className="verify-info-title">
                {t(translations.contract.verify.otherSettings)}
              </span>
              <span className="verify-info-content">{license}</span>
            </Col>
          </Row>
        </>
      ) : (
        <div
          className={clsx('contract-code-verified contract-verify-tip', {
            'margin-bottom-0': !exactMatch && !sourceCode && !abi,
          })}
        >
          {t(translations.contract.verify.tipLeft)}
          <Link
            href={`/contract-verification?address=${SDK.address.simplifyCfxAddress(
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
          {sourceCode && exactMatch ? (
            <>
              <div className="contract-sourcecode-and-abi-title">
                {t(translations.contract.sourceCodeShort)}
              </div>
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
              />{' '}
            </>
          ) : null}
        </div>
        <div className="contract-abi">
          {abi && exactMatch ? (
            <>
              <div className="contract-sourcecode-and-abi-title">
                {t(translations.contract.abi)}
              </div>
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
            </>
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

    &.margin-bottom-0 {
      margin-bottom: 0;
    }
  }

  .contract-code-verify-info {
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
  const { abi, address, verify = {} } = contractInfo;
  const [activeKey, setActiveKey] = useState('code');

  let tabs = [
    {
      key: 'code',
      label: t(translations.contract.code),
    },
  ];

  if (abi && Object.keys(verify).length) {
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
            <ContractAbi type="read" address={address} abi={abi}></ContractAbi>
          )}
          {activeKey === 'write' && (
            <ContractAbi type="write" address={address} abi={abi}></ContractAbi>
          )}
        </ContractCard>
      </ContractBody>
    </>
  );
};

const ContractBody = styled.div`
  background-color: #ffffff;
  border-radius: 4px;

  .contract-body-subtabs {
    padding: 0.5714rem 1.2857rem;
    border-bottom: 1px solid #e8e9ea;
  }
`;

const ContractCard = styled(Card)`
  padding-bottom: 1.2857rem !important;
`;
