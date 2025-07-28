import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Form, Input, Button, Row, Col, Select, Collapse } from '@cfxjs/antd';
import { isCurrentNetworkAddress } from 'utils';
import { FileUpload } from '@cfxjs/sirius-next-common/dist/components/FileUpload';
import { useMessages } from '@cfxjs/react-ui';
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';
import 'ace-mode-solidity/build/remix-ide/mode-solidity';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { DEFAULT_VYPER_CONTRACT_NAME, SOLIDITY_CODE_FORMAT } from './constants';
import { Remark } from '@cfxjs/sirius-next-common/dist/components/Remark';
import { CoreAddressContainer } from '@cfxjs/sirius-next-common/dist/components/AddressContainer/CoreAddressContainer';
import { ReactComponent as ChevronLeftIcon } from 'images/chevron-left.svg';
import { StyledButtonWrapper, StyledContractInfoRow } from './StyledComponents';

const { Panel } = Collapse;
const { Option } = Select;
const AceEditorStyle = {
  width: '100%',
  backgroundColor: '#F8F9FB',
  minHeight: '28.5714rem',
};

export interface Step2SubmitData {
  name: string;
  license: string;
  sourceCode: string;
  evmVersion: string;
  runs?: string;
  optimization?: string;
  library?: {
    key: number;
    name: string;
    address: string;
  }[];
}

const DEFAULT_OPTIMIZATION_VALUE = 'no';

export const Step2: React.FC<{
  contractDetails: {
    address: string;
    codeFormat?: string;
    compiler?: string;
    codeFormatLabel?: string;
    compilerLabel?: string;
  };
  license: any[];
  versions: any[];
  respErrors: string[];
  loading: boolean;
  onSubmit: (data: Step2SubmitData) => void;
  onBack: () => void;
}> = ({
  license,
  versions,
  respErrors,
  contractDetails,
  loading,
  onSubmit,
  onBack,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [form] = Form.useForm<Step2SubmitData>();
  const [, setMessage] = useMessages();
  const [sourceCode, setSourceCode] = useState('');
  const [optimizationValue, setOptimizationValue] = useState(
    DEFAULT_OPTIMIZATION_VALUE,
  );

  const isSolidity = contractDetails.codeFormat === SOLIDITY_CODE_FORMAT;

  const isAddressValidator = (_, value) => {
    if (!value || isCurrentNetworkAddress(value)) {
      return Promise.resolve();
    }
    return Promise.reject(
      new Error(t(translations.general.advancedSearch.error.invalidAddress)),
    );
  };

  const onFinish = () => {
    onSubmit(form.getFieldsValue());
  };
  const handleImport = () => {
    inputRef.current?.click();
  };
  const handleFileChange = data => {
    try {
      setSourceCode(data);
      form.setFieldsValue({
        sourceCode: data,
      });
    } catch (e) {}
  };

  const handleFileError = e => {
    setMessage({
      text: e?.toString?.(),
      color: 'error',
    });
  };

  const handleSourceCodeChange = data => {
    setSourceCode(data);
    form.setFieldsValue({
      sourceCode: data,
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

  const handleReset = () => {
    form.resetFields();
    setSourceCode('');
    setOptimizationValue(DEFAULT_OPTIMIZATION_VALUE);
  };

  return (
    <>
      <FileUpload
        ref={inputRef}
        onChange={handleFileChange}
        onError={handleFileError}
        accept={isSolidity ? '.sol' : '.vy'}
      />
      <div className="form-title">
        {t(translations.contractVerification.stepTitle.step2)}
      </div>
      {!isSolidity && (
        <Remark
          items={[
            t(translations.contractVerification.vyperNotice.first),
            t(translations.contractVerification.vyperNotice.second),
          ]}
          hideTitle
        />
      )}
      <StyledContractInfoRow>
        <div className="contract-info-label">
          {t(translations.contractVerification.contractAddress)}
        </div>
        <div className="contract-info-value">
          <CoreAddressContainer value={contractDetails.address} isFull />
        </div>
      </StyledContractInfoRow>
      <StyledContractInfoRow>
        <div className="contract-info-label">
          {t(translations.contractVerification.compilerType)}
        </div>
        <div className="contract-info-value">
          {contractDetails.codeFormatLabel}
        </div>
      </StyledContractInfoRow>
      <StyledContractInfoRow $marginBottom="1.7143rem">
        <div className="contract-info-label">
          {t(translations.contractVerification.compilerVersion)}
        </div>
        <div className="contract-info-value">
          {contractDetails.compilerLabel}
        </div>
      </StyledContractInfoRow>
      <Form
        name="configuration"
        onFinish={onFinish}
        validateTrigger="onBlur"
        layout="vertical"
        scrollToFirstError={true}
        form={form}
      >
        <Form.Item
          name="sourceCode"
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
        {isSolidity && (
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
                                  validator: isAddressValidator,
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
        )}
        <Row gutter={24}>
          <Col span={24} md={8}>
            <Form.Item
              name="name"
              label={t(translations.contractVerification.contractName)}
              rules={[
                {
                  required: true,
                  message: t(
                    translations.contractVerification.error.pleaseEnter,
                  ),
                },
              ]}
              initialValue={
                isSolidity ? undefined : DEFAULT_VYPER_CONTRACT_NAME
              }
              validateFirst
            >
              <Input
                placeholder={t(
                  translations.contractVerification.placeholder.contractName,
                )}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
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
          {isSolidity && (
            <>
              <Col span={24} md={8}>
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
                  initialValue={DEFAULT_OPTIMIZATION_VALUE}
                  validateFirst
                >
                  <Select
                    onChange={onOptimizationChange}
                    placeholder={t(
                      translations.contractVerification.placeholder
                        .optimization,
                    )}
                  >
                    <Option value="yes">
                      {t(
                        translations.contractVerification.OptimizationOption
                          .yes,
                      )}
                    </Option>
                    <Option value="no">
                      {t(
                        translations.contractVerification.OptimizationOption.no,
                      )}
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} md={8}>
                <Form.Item
                  name="runs"
                  label={t(translations.contractVerification.runs)}
                  validateFirst
                  initialValue="0"
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
            </>
          )}
          <Col span={24} md={8}>
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
        {respErrors.length ? (
          <Form.Item
            style={{
              marginBottom: 0,
              marginTop: '1rem',
            }}
          >
            <div className="errors-container">
              {respErrors.map((e, index) => (
                <div className="error-item" key={index}>
                  {e}
                </div>
              ))}
            </div>
          </Form.Item>
        ) : null}
        <StyledButtonWrapper>
          <Button
            type="default"
            loading={loading}
            className="submit-button"
            onClick={onBack}
          >
            <ChevronLeftIcon />
            {t(translations.contractVerification.button.previous)}
          </Button>
          <Button
            type="default"
            loading={loading}
            className="submit-button"
            onClick={handleReset}
          >
            {t(translations.contractVerification.button.reset)}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
          >
            {t(translations.report.submit)}
          </Button>
        </StyledButtonWrapper>
      </Form>
    </>
  );
};
