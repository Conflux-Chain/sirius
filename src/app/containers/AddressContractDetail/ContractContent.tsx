import React, { useState, useEffect, useMemo } from 'react';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ContractAbi } from 'app/components/ContractAbi/Loadable';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import { Link } from '@cfxjs/sirius-next-common/dist/components/Link';
import clsx from 'clsx';
import { Row, Col, Tag } from '@cfxjs/antd';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { CFX } from 'utils/constants';
import lodash from 'lodash';
import { formatData } from 'app/components/TxnComponents/util';
import { monospaceFont } from 'styles/variable';
import CheckCircle from '@zeit-ui/react-icons/checkCircle';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { isInnerContractAddress } from 'utils';
import { SubTabs } from 'app/components/Tabs/Loadable';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import imgInfo from 'images/info.svg';
import imgSimilarMatch from 'images/similar-match.svg';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { getNetwork } from '@cfxjs/sirius-next-common/dist/utils';
import { shortenAddress } from '@cfx-kit/dapp-utils/dist/address';

const AceEditorStyle = {
  width: '100%',
  backgroundColor: '#F8F9FB',
};

export const CheckCircleIcon = (size?) => (
  <CheckCircle size={typeof size === 'number' ? size : 16} color="#7cd77b" />
);

const Code = ({ contractInfo }) => {
  const { t } = useTranslation();
  const [globalData] = useGlobalData();
  const { networks } = globalData;
  const { sourceCode, abi, address, verify = {} } = contractInfo;
  const {
    exactMatch,
    license,
    name,
    optimization,
    runs,
    version,
    constructorArgs,
    libraries = [],
    evmVersion,
    language,
    similarMatchAddress,
    similarMatchNetworkId,
    crossSpace,
  } = verify;

  const isSolidity = language === 'solidity';
  const isSimilarMatched = !!similarMatchAddress;
  const similarMatchAddressLink = useMemo(() => {
    if (!similarMatchAddress) return '';
    if (!crossSpace) return `/address/${similarMatchAddress}`;
    const network = getNetwork(networks, similarMatchNetworkId);
    return `${network.url}/address/${similarMatchAddress}`;
  }, [similarMatchAddress, crossSpace, similarMatchNetworkId, networks]);

  const constructor = useMemo(() => {
    if (constructorArgs && abi && address) {
      try {
        const contract = CFX.Contract({
          abi,
          address,
        });

        const data = contract.abi.decodeData(constructorArgs);

        if (data === '0x' || !data) {
          return null;
        } else {
          const encodeArgs = lodash.words(constructorArgs.substr(2), /.{64}/g);

          const { object, fullName } = data;

          try {
            if (fullName === 'constructor()') {
              return {
                fullArgs: constructorArgs,
                encodeArgs,
                decodeArgs: [],
              };
            } else {
              let types = (/constructor\((.*)\)/.exec(fullName) as string[])[1]
                .split(',')
                .map(t => {
                  return t.trim().split(' ');
                })
                .map(i => {
                  return i.concat(
                    formatData(object[i[1]], i[0], {
                      space: null,
                    }),
                  );
                });
              return {
                fullArgs: constructorArgs,
                encodeArgs,
                decodeArgs: types,
              };
            }
          } catch (error) {
            return {
              fullArgs: constructorArgs,
              encodeArgs,
              decodeArgs: [],
            };
          }
        }
      } catch (error) {
        return null;
      }
    }
  }, [abi, address, constructorArgs]);

  const sourceCodeContent = useMemo(() => {
    let fSourceCode = sourceCode;

    try {
      const jSourceCode = JSON.parse(sourceCode);

      // contains multiple sourcecode file
      if (jSourceCode.sources) {
        fSourceCode = Object.keys(jSourceCode.sources).map(k => {
          const filenameMatch = /([^/]*)$/.exec(k);
          let key = k;

          if (filenameMatch) {
            key = filenameMatch[0];
          }

          return {
            key,
            content: jSourceCode.sources[k].content,
          };
        });
      }
    } catch (error) {
      // single sourcecode file
    }

    if (typeof fSourceCode === 'string') {
      console.log(typeof sourceCode);
      return (
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
      );
    } else if (fSourceCode) {
      const len = fSourceCode.length;

      return fSourceCode.map((s, i) => (
        <>
          {isSolidity && (
            <div className={`multiple-sourcecode-title ${i === 0 && 'first'}`}>
              {t(translations.contract.sourceCodeFilename, {
                index: i + 1,
                total: len,
                filename: s.key,
              })}
            </div>
          )}
          <AceEditor
            readOnly
            style={AceEditorStyle}
            mode="solidity"
            theme="tomorrow"
            name="UNIQUE_ID_OF_DIV"
            setOptions={{
              showLineNumbers: true,
            }}
            value={s.content}
            wrapEnabled={true}
            height="20rem"
            fontSize="1rem"
            showGutter={false}
            showPrintMargin={false}
          />
        </>
      ));
    } else {
      return null;
    }
  }, [t, isSolidity, sourceCode]);

  if (!contractInfo.codeHash && !isInnerContractAddress(address)) {
    return (
      <StyledContractContentCodeWrapper>
        <StyledNullWrapper>0x</StyledNullWrapper>
      </StyledContractContentCodeWrapper>
    );
  }

  return (
    <StyledContractContentCodeWrapper>
      {exactMatch ? (
        <>
          {isSimilarMatched && (
            <>
              <div className="contract-code-verified">
                <img
                  src={imgSimilarMatch}
                  alt="similar-match"
                  width="16px"
                  className="mr-6px"
                />
                {t(translations.contract.verify.contractCodeSimilarMatch)}
              </div>
              <div className="contract-code-similar-match-tips">
                <div className="contract-code-similar-match-tip">
                  <img src={imgInfo} alt="info" width="16px" />
                  <Trans
                    i18nKey={
                      translations.contract.verify.similarMatchTips.first
                    }
                    values={{
                      address: shortenAddress(similarMatchAddress),
                    }}
                  >
                    This contract matches the deployed Bytecode of the Source
                    Code for Contract
                    <Link href={similarMatchAddressLink}>address</Link>
                  </Trans>
                </div>
                <div className="contract-code-similar-match-tip">
                  <img src={imgInfo} alt="info" width="16px" />
                  {t(translations.contract.verify.similarMatchTips.second)}
                </div>
              </div>
            </>
          )}
          {!isSimilarMatched && (
            <div className="contract-code-verified">
              {t(translations.contract.verify.contractCodeVerified)}{' '}
              <Tooltip
                title={t(translations.contract.verify.verifiedTooltip)}
                className="ml-8px"
              >
                <CheckCircleIcon />
              </Tooltip>
            </div>
          )}
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
                {!isSolidity
                  ? optimization
                  : t(translations.contract.verify.runs, {
                      count: runs,
                      status: optimization ? 'yes' : 'no',
                    })}
              </span>
            </Col>
            <Col span={6} sm={12} xs={24}>
              <span className="verify-info-title">
                {t(translations.contract.verify.otherSettings)}
              </span>
              <span className="verify-info-content">
                {t(translations.contract.verify.evmVersion, {
                  version: evmVersion || 'default',
                })}
              </span>
              {', '}
              <span className="verify-info-content">
                {t(translations.contract.verify.license, {
                  license,
                })}
              </span>
            </Col>
          </Row>
        </>
      ) : (
        <div
          className={clsx('contract-code-verified contract-verify-tip', {
            'margin-bottom-0': !exactMatch && !sourceCode && !abi,
          })}
        >
          <Trans i18nKey={translations.contract.verify.tip}>
            You can now
            <Link
              href={`/contract-verification?address=${SDK.address.simplifyCfxAddress(
                address,
              )}`}
            >
              verify and publish
            </Link>
            your contract's source code, or simply
            <Link href="/abi-verification">submit function signatures</Link> to
            improve readability.
          </Trans>
        </div>
      )}
      <div className="contract-sourcecode-and-abi">
        <div>
          {sourceCode && exactMatch ? (
            <>
              <div className="contract-sourcecode-and-abi-title">
                {t(translations.contract.sourceCodeShort)}
              </div>
              {sourceCodeContent}
            </>
          ) : null}
        </div>
        <div>
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
        <div>
          {constructor && exactMatch ? (
            <>
              <div className="contract-sourcecode-and-abi-title">
                {t(translations.contract.constructorArgs)}

                {/* <div className="subtitle">
                  {t(translations.contract.constructorArgsTips)}
                </div> */}
              </div>
              <div className="pre">
                <div>{constructor.fullArgs}</div>
                <div>
                  <div className="split-line">
                    -----{t(translations.contract.decodedView)}---------------
                  </div>
                  {constructor.decodeArgs.map((a, i) => (
                    <div>
                      Arg[{i}] : {a[1]} ({a[0]}): {a[2]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="split-line">
                    -----{t(translations.contract.encodedView)}---------------
                  </div>
                  <div>
                    {constructor.encodeArgs.length} Constructor Arguments found
                    :
                  </div>
                  {constructor.encodeArgs.map((a, i) => (
                    <div>
                      Arg[{i}] : {a}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
        {!!libraries?.length && (
          <div>
            <div className="contract-sourcecode-and-abi-title">
              {t(translations.contract.libraryContracts)}
            </div>
            <div className="contract-library-body">
              {libraries.map(l => (
                <div>
                  <span>{l.name}: </span>
                  <span>
                    <CoreAddressContainer
                      value={l.address}
                      isFull={true}
                      showIcon={false}
                    ></CoreAddressContainer>
                  </span>{' '}
                  <span>
                    {l.exactMatch ? (
                      <Tag color="green">
                        {t(translations.general.verifiedContract)}
                      </Tag>
                    ) : (
                      <Tag color="red">
                        {t(translations.general.unverifiedContract)}
                      </Tag>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StyledContractContentCodeWrapper>
  );
};

const StyledContractContentCodeWrapper = styled.div`
  .contract-code-verified {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #0f1327;
    line-height: 22px;
    margin: 15px 0;

    &.margin-bottom-0 {
      margin-bottom: 0;
    }

    .ml-8px {
      margin-left: 8px;
    }
    .mr-6px {
      margin-right: 6px;
    }
  }
  .contract-code-similar-match-tips {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 15px 0;
    .contract-code-similar-match-tip {
      font-size: 14px;
      font-weight: 450;
      color: #74798c;
      line-height: 22px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  .contract-verify-tip {
    a {
      margin: 0 4px;
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

    .contract-sourcecode-fullscreen {
      cursor: pointer;
    }

    .subtitle {
      color: var(--theme-color-gray2);
      font-size: 0.875rem;
    }
  }

  .split-line {
    margin-top: 1.5rem;
  }

  .pre {
    font-size: 1rem;
    background-color: rgb(248, 249, 251);
    padding: 5px 10px;
    max-height: 28rem;
    overflow: auto;
    font-family: ${monospaceFont};
  }

  .contract-library-body {
    font-size: 1rem;
    background-color: rgb(248, 249, 251);
    padding: 5px 10px;
  }

  .multiple-sourcecode-title {
    margin: 30px 0 10px;
    color: var(--theme-color-gray2);
    font-weight: bold;

    &.first {
      margin-top: 10px;
    }
  }
`;

type TabsItemType = {
  key: string;
  label: string;
  abi?: Array<unknown>;
  content: React.ReactNode;
};

export const ContractContent = ({ contractInfo }) => {
  const { t } = useTranslation();
  const {
    abi,
    address,
    verify = {},
    proxy = {},
    implementation = {},
    destroy = {},
    beacon = {},
  } = contractInfo;
  const [activeIndex, setActiveIndex] = useState(0);
  const [initError, setInitError] = useState(false);

  // some contract init will trigger SDK error, need SDK to solve it
  useEffect(() => {
    try {
      CFX.Contract({
        abi,
        address,
      });
      setInitError(false);
    } catch (error) {
      setInitError(true);
    }
  }, [abi, address]);

  let tabs: Array<TabsItemType> = [
    {
      key: 'code',
      label: t(translations.contract.code),
      content: <Code contractInfo={contractInfo} />,
    },
  ];

  if (!initError && abi && destroy.status === 0 && Object.keys(verify).length) {
    tabs = tabs.concat([
      {
        key: 'read',
        label: t(translations.contract.readContract),
        abi,
        content: (
          <ContractAbi
            type="read"
            address={address}
            abi={abi}
            key={`contract-read-${address}`}
          ></ContractAbi>
        ),
      },
      {
        key: 'write',
        label: t(translations.contract.writeContract),
        abi,
        content: (
          <ContractAbi
            type="write"
            address={address}
            abi={abi}
            key={`contract-write-${address}`}
          ></ContractAbi>
        ),
      },
    ]);
  }

  // check if is a proxy contract
  if (!initError && proxy?.proxy && implementation?.address) {
    // proxy contract
    if (implementation?.verify?.exactMatch) {
      tabs = tabs.concat([
        {
          key: 'readAsProxy',
          label: t(translations.contract.readAsProxyContract),
          content: (
            <ContractAbi
              type="read"
              address={implementation.address}
              pattern={proxy.proxyPattern}
              proxyAddress={address}
              beaconAddress={beacon.address}
              key={`contract-implementation-read-${address}`}
            ></ContractAbi>
          ),
        },
        {
          key: 'writeAsProxy',
          label: t(translations.contract.writeAsProxyContract),
          content: (
            <ContractAbi
              type="write"
              address={implementation.address}
              pattern={proxy.proxyPattern}
              proxyAddress={address}
              beaconAddress={beacon.address}
              key={`contract-implementation-write-${address}`}
            ></ContractAbi>
          ),
        },
      ]);
    }
  } else {
    // nomral contract
  }

  const clickHandler = (key, index) => {
    setActiveIndex(index);
    if (key) {
      trackEvent({
        category: ScanEvent.tab.category,
        action:
          ScanEvent.tab.action[
            `contract${
              (key + '').charAt(0).toUpperCase() + (key + '').slice(1)
            }`
          ],
      });
    }
  };

  useEffect(() => {
    // reset index
    setActiveIndex(0);
  }, [address]);

  return (
    <ContractBody>
      <SubTabs
        tabs={tabs}
        activeKey={tabs[activeIndex]?.key}
        onChange={clickHandler}
        className="contract-body-subtabs"
        extra={
          implementation?.address && !implementation?.verify?.exactMatch ? (
            <Trans i18nKey="contract.notVerifyImplementContract">
              <Link
                href={`/contract-verification?address=${implementation.address}`}
                style={{ margin: '0 5px' }}
              >
                contract verification
              </Link>
            </Trans>
          ) : (
            ''
          )
        }
      ></SubTabs>
      <ContractCard>{tabs[activeIndex]?.content}</ContractCard>
    </ContractBody>
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

const StyledNullWrapper = styled.div`
  background-color: var(--theme-color-gray0);
  margin-top: 1.4286rem;
  padding: 0.4286rem;
`;
