import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'sirius-next/packages/common/dist/components/PageHeader';
import { Remark } from 'app/components/Remark';
import styled from 'styled-components';
import { Card } from 'sirius-next/packages/common/dist/components/Card';
import { Form, Input, Button, Row, Col, Select, Collapse } from '@cfxjs/antd';
import { isContractAddress, isCurrentNetworkAddress } from 'utils';
import {
  reqContractCompiler,
  reqContractLicense,
  reqEVMVersion,
  reqContractVerification,
} from 'utils/httpRequest';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { FileUpload } from 'sirius-next/packages/common/dist/components/FileUpload';
import { useMessages } from '@cfxjs/react-ui';
import { StatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import { useLocation } from 'react-router-dom';
import querystring from 'query-string';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

const { Panel } = Collapse;
const { Option } = Select;
const AceEditorStyle = {
  width: '100%',
  backgroundColor: '#F8F9FB',
  minHeight: '28.5714rem',
};

export const ContractVerification = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const [, setMessage] = useMessages();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [license, setLicense] = useState<Array<any>>([]);
  const [compilers, setCompilers] = useState<Array<any>>([]);
  const [versions, setVersions] = useState<Array<any>>([]);
  const [optimizationValue, setOptimizationValue] = useState<string>('no');
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceCode, setSourceCode] = useState('');
  const [modalStatus, setModalStatus] = useState('loading');
  const [modalShow, setModalShow] = useState(false);
  const [respErrors, setRespErrors] = useState<Array<string>>([]);

  const isAddress = (_, value) => {
    if (!value || isCurrentNetworkAddress(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(t(translations.general.advancedSearch.error.invalidAddress)),
    );
  };

  useEffect(() => {
    reqContractCompiler().then(resp => {
      setCompilers(
        Object.keys(resp).map(r => ({
          key: r,
          value: resp[r],
        })),
      );
    });

    reqContractLicense().then(resp => {
      setLicense(
        Object.keys(resp).map(r => ({
          key: r,
          value: resp[r],
        })),
      );
    });

    reqEVMVersion().then(resp => {
      setVersions(
        [
          {
            key: 'default',
            value: ' ',
          },
        ].concat(
          resp.map(r => ({
            key: r,
            value: r,
          })),
        ),
      );
    });
  }, []);

  const onFinish = (data: any) => {
    const payload: {
      address: string;
      name: string;
      sourceCode: string;
      compiler: string;
      license: string;
      optimizeRuns?: number;
      evmVersion?: string;
    } = {
      address: data.contractAddress,
      name: data.contractName,
      sourceCode: data.contractSourceCode,
      compiler: data.compiler,
      license: data.license,
    };

    if (data.optimization === 'yes') {
      payload.optimizeRuns = Number(data.runs);
    }

    payload.evmVersion = data.evmVersion.trim();

    data.library?.forEach(l => {
      if (l.name && l.address) {
        payload[`libraryName${l.key}`] = l.name;
        payload[`libraryAddress${l.key}`] = l.address;
      }
    });

    setModalStatus('loading');
    setModalShow(true);
    setLoading(true);
    setRespErrors([]);

    reqContractVerification(payload)
      .then(resp => {
        if (resp.exactMatch) {
          setModalStatus('success');
        } else {
          setModalStatus('error');
          if (resp.errors?.length) {
            setRespErrors(resp.errors);
          } else {
            // bytecode not match
            setRespErrors([
              t(translations.contractVerification.error.notMatch),
            ]);
          }
        }
      })
      .catch(e => {
        setModalStatus('error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onOptimizationChange = (value: string) => {
    setOptimizationValue(value);
    let runsValue = '0';
    if (value === 'yes') {
      runsValue = '200';
    }
    form.setFieldsValue({
      runs: runsValue,
    });
  };

  const handleImport = () => {
    inputRef.current?.click();
  };

  const handleFileChange = data => {
    try {
      setSourceCode(data);
      form.setFieldsValue({
        contractSourceCode: data,
      });
    } catch (e) {}
  };

  const handleFileError = e => {
    setMessage({
      text: e,
      color: 'error',
    });
  };

  const handleSourceCodeChange = data => {
    setSourceCode(data);
    form.setFieldsValue({
      contractSourceCode: data,
    });
  };

  const onStatusModalClose = () => {
    setModalShow(false);
  };

  return (
    <StyledContractVerificationWrapper>
      <Helmet>
        <title>{t(translations.contractVerification.title)}</title>
        <meta
          name="description"
          content={t(translations.contractVerification.description)}
        />
      </Helmet>
      <FileUpload
        ref={inputRef}
        onChange={handleFileChange}
        onError={handleFileError}
        accept=".sol"
      />
      <StatusModal
        status={modalStatus}
        show={modalShow}
        onClose={onStatusModalClose}
        loadingText={t(translations.contractVerification.status.loading)}
        successText={t(translations.contractVerification.status.success)}
        errorText={t(translations.contractVerification.status.error)}
      />
      <PageHeader>{t(translations.contractVerification.title)}</PageHeader>
      <Card className="contract-verification-form-container">
        <Form
          name="nest-messages"
          onFinish={onFinish}
          validateTrigger="onBlur"
          layout="vertical"
          initialValues={{
            address: '',
          }}
          scrollToFirstError={true}
          form={form}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="contractAddress"
                label={t(translations.contractVerification.contractAddress)}
                initialValue={querystring.parse(search).address}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.pleaseEnter,
                    ),
                  },
                  () => ({
                    validator(_, value) {
                      const textInvalidAddress = t(
                        translations.contractVerification.error.isNotAddress,
                      );
                      const address = value.trim();

                      if (
                        isContractAddress(address) &&
                        SDK.address.isValidCfxAddress(address)
                      ) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject(new Error(textInvalidAddress));
                      }
                    },
                  }),
                ]}
                validateFirst
              >
                <Input
                  placeholder={t(
                    translations.contractVerification.placeholder
                      .contractAddress,
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contractName"
                label={t(translations.contractVerification.contractName)}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.pleaseEnter,
                    ),
                  },
                ]}
                validateFirst
              >
                <Input
                  placeholder={t(
                    translations.contractVerification.placeholder.contractName,
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="license"
                label={t(translations.contractVerification.license)}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.pleaseSelect,
                    ),
                  },
                ]}
                validateFirst
              >
                <Select
                  placeholder={t(
                    translations.contractVerification.placeholder.license,
                  )}
                >
                  {license.map((l, index) => (
                    <Option value={l.key} key={l.key}>
                      {index + 1}) {l.value}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="compiler"
                label={t(translations.contractVerification.compiler)}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.pleaseSelect,
                    ),
                  },
                ]}
                validateFirst
              >
                <Select
                  placeholder={t(
                    translations.contractVerification.placeholder.compiler,
                  )}
                >
                  {compilers.map(l => (
                    <Option value={l.key} key={l.key}>
                      {l.value.replace(/soljson-|.js/g, '')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="optimization"
                label={t(translations.contractVerification.optimization)}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.required,
                    ),
                  },
                ]}
                initialValue={optimizationValue}
                validateFirst
              >
                <Select
                  onChange={onOptimizationChange}
                  placeholder={t(
                    translations.contractVerification.placeholder.optimization,
                  )}
                >
                  <Option value={'yes'}>
                    {t(
                      translations.contractVerification.OptimizationOption.yes,
                    )}
                  </Option>
                  <Option value={'no'}>
                    {t(translations.contractVerification.OptimizationOption.no)}
                  </Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="runs"
                label={t(translations.contractVerification.runs)}
                validateFirst
                initialValue={'0'}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.required,
                    ),
                  },
                  {
                    min: 0,
                    type: 'number',
                    transform: value => Number(value),
                    message: t(translations.contractVerification.error.min),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder={t(
                    translations.contractVerification.placeholder.runs,
                  )}
                  disabled={optimizationValue === 'no'}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="evmVersion"
                label={t(translations.contractVerification.evmVersion)}
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.pleaseSelect,
                    ),
                  },
                ]}
                validateFirst
                initialValue={' '}
              >
                <Select
                  placeholder={t(
                    translations.contractVerification.placeholder.license,
                  )}
                >
                  {versions.map((l, index) => (
                    <Option value={l.value} key={l.key}>
                      {index + 1}) {l.key}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="contractSourceCode"
            label={t(translations.contractVerification.contractSourceCode)}
            rules={[
              {
                required: true,
                message: t(translations.contractVerification.error.pleaseEnter),
              },
            ]}
            validateFirst
          >
            <Input style={{ display: 'none' }}></Input>
            <div className="link-and-fullscreen">
              <div className="link" onClick={handleImport}>
                {t(translations.contractVerification.upload)}
              </div>
            </div>
            <AceEditor
              style={AceEditorStyle}
              mode="solidity"
              theme="tomorrow"
              name="UNIQUE_ID_OF_DIV"
              setOptions={{
                wrap: true,
                indentedSoftWrap: false,
                showLineNumbers: true,
              }}
              height="28rem"
              fontSize="1rem"
              showGutter={false}
              showPrintMargin={false}
              value={sourceCode}
              onChange={handleSourceCodeChange}
            />
          </Form.Item>
          <Collapse
            bordered={false}
            expandIcon={props => {
              return (
                <span>
                  {props.isActive
                    ? t(translations.general.fold)
                    : t(translations.general.expand)}
                </span>
              );
            }}
          >
            <Panel
              header={
                <span>
                  {t(translations.contractVerification.contractLibraryAddress)}{' '}
                  <small>
                    {t(
                      translations.contractVerification
                        .contractLibraryAddressTip,
                    )}
                  </small>
                </span>
              }
              key="1"
              className="collapse-body"
            >
              <Form.List
                name="library"
                initialValue={Array.from(Array(10), (k, i) => ({
                  key: i + 1,
                  name: '',
                  address: '',
                }))}
              >
                {fields => (
                  <>
                    {fields.map(({ key, name, ...restField }) => {
                      return (
                        <Row key={key}>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              label={t(
                                translations.contractVerification.libraryName,
                                {
                                  index: key + 1,
                                },
                              )}
                            >
                              <Input placeholder="" />
                            </Form.Item>
                          </Col>
                          <Col span={1} style={{ textAlign: 'center' }}>
                            <Form.Item label=" ">&rarr;</Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              {...restField}
                              name={[name, 'address']}
                              label={t(
                                translations.contractVerification
                                  .libraryContractAddress,
                                {
                                  index: key + 1,
                                },
                              )}
                              rules={[
                                () => ({
                                  validator: isAddress,
                                }),
                              ]}
                            >
                              <Input placeholder="" />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    })}
                  </>
                )}
              </Form.List>
            </Panel>
          </Collapse>
          <Form.Item
            style={{
              marginBottom: 0,
              marginTop: '1rem',
            }}
          >
            {respErrors.length ? (
              <div className="errors-container">
                {respErrors.map((e, index) => (
                  <div className="error-item" key={index}>
                    {e}
                  </div>
                ))}
              </div>
            ) : null}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="submit-button"
            >
              {t(translations.report.submit)}
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <StyledRemarkWrapper>
        <Remark
          items={[
            t(translations.contractVerification.notice.first),
            t(translations.contractVerification.notice.second),
            t(translations.contractVerification.notice.third),
            t(translations.contractVerification.notice.fourth),
          ]}
        ></Remark>
      </StyledRemarkWrapper>
    </StyledContractVerificationWrapper>
  );
};

const StyledRemarkWrapper = styled.div`
  margin-bottom: 1.7143rem;
  margin-top: 1.7143rem;
`;

const StyledContractVerificationWrapper = styled.div`
  .card.contract-verification-form-container {
    padding: 0.8571rem 1.4286rem 1.2857rem 1.4286rem;
  }

  .link-and-fullscreen {
    position: absolute;
    right: 0;
    top: -2rem;
    display: flex;
    align-items: center;
    justify-content: center;

    .link {
      color: var(--theme-color-blue2);
      font-weight: 500;
      line-height: 1.2857rem;
      text-align: right;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .errors-container {
    color: #e64e4e;
    margin-bottom: 0.7143rem;
    margin-top: -0.7143rem;

    .error-item {
      font-size: 12px;
      line-height: 1.2;
    }
  }

  .collapse-body {
    border-bottom: none !important;
    margin-top: -12px;

    .ant-collapse-header {
      background-color: #ffffff;

      & > span {
        margin-left: -1rem !important;
      }
    }

    .ant-collapse-content-box {
      padding-top: 16px !important;
    }

    .ant-collapse-arrow {
      float: right;
      margin-right: -1rem !important;
      color: var(--theme-color-blue2);
      text-decoration: underline;
      font-weight: 500;
    }
  }
`;
