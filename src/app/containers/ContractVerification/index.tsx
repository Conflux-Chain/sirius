import React, { useState, useEffect, createRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Remark } from 'app/components/Remark';
import styled from 'styled-components/macro';
import { Card } from 'app/components/Card/Loadable';
import { Form, Input, Button, Row, Col, Select } from '@jnoodle/antd';
import { isContractAddress } from 'utils';
import {
  reqContractCompiler,
  reqContractLicense,
  reqContractVerification,
} from 'utils/httpRequest';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { FileUpload } from 'app/components/FileUpload';
import { useMessages } from '@cfxjs/react-ui';
import { cfxAddress } from 'utils/cfx';
import { StatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import FullScreen from '@zeit-ui/react-icons/fullScreen';
import FullScreenClose from '@zeit-ui/react-icons/fullScreenClose';
import { useLocation } from 'react-router-dom';
import querystring from 'query-string';

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
  const [optimizationValue, setOptimizationValue] = useState<string>('no');
  const inputRef = createRef<any>();
  const [sourceCode, setSourceCode] = useState('');
  const [modalStatus, setModalStatus] = useState('loading');
  const [modalShow, setModalShow] = useState(false);
  const [respErrors, setRespErrors] = useState<Array<string>>([]);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

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
  }, []);

  const onFinish = (data: any) => {
    const payload: {
      address: string;
      name: string;
      sourceCode: string;
      compiler: string;
      license: string;
      optimizeRuns?: number;
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
          setRespErrors(resp.errors);
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
    inputRef.current.click();
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
                        cfxAddress.isValidCfxAddress(address)
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
              <span
                className="fullscreen"
                onClick={() => {
                  setFullscreen(!fullscreen);
                }}
              >
                {fullscreen ? (
                  <FullScreenClose size={16}></FullScreenClose>
                ) : (
                  <FullScreen size={16}></FullScreen>
                )}
              </span>
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
              maxLines={fullscreen ? Infinity : 20}
              fontSize="1rem"
              showGutter={false}
              showPrintMargin={false}
              value={sourceCode}
              onChange={handleSourceCodeChange}
            />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: 0,
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
      color: #1e3de4;
      font-weight: 500;
      line-height: 1.2857rem;
      text-align: right;
      text-decoration: underline;
      cursor: pointer;
    }

    .fullscreen {
      margin-left: 0.3571rem;
      width: 1.1429rem;
      height: 1.1429rem;
      display: flex;
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
`;
