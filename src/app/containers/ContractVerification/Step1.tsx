import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Remark } from '@cfxjs/sirius-next-common/dist/components/Remark';
import { Form, Input, Button, Row, Col, Select } from '@cfxjs/antd';
import { isCoreContractAddress } from 'utils';
import { SOLIDITY_CODE_FORMAT } from './constants';
import { StyledButtonWrapper, StyledRemarkWrapper } from './StyledComponents';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

const { Option } = Select;

export const Step1: React.FC<{
  loading: boolean;
  codeFormats: {
    key: string;
    value: string;
  }[];
  solidityCompilers: any[];
  vyperCompilers: any[];
  initialValues: {
    address: string;
    codeFormat?: string;
    compiler?: string;
  };
  onNext: (data: {
    address: string;
    codeFormat: string;
    codeFormatLabel: string;
    compiler: string;
    compilerLabel: string;
  }) => void;
}> = ({
  loading,
  solidityCompilers,
  vyperCompilers,
  codeFormats,
  initialValues,
  onNext,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<{
    address: string;
    codeFormat: string;
    compiler: string;
  }>();
  const [codeFormat, setCodeFormat] = useState(initialValues.codeFormat);
  const compilers = !codeFormat
    ? []
    : codeFormat === SOLIDITY_CODE_FORMAT
    ? solidityCompilers
    : vyperCompilers;
  const onFinish = () => {
    const values = form.getFieldsValue();
    onNext({
      ...values,
      codeFormatLabel: codeFormats.find(f => f.key === values.codeFormat)!
        .value,
      compilerLabel: compilers.find(c => c.key === values.compiler)!.value,
    });
  };
  return (
    <>
      <div className="form-title">
        {t(translations.contractVerification.stepTitle.step1)}
      </div>
      <Form
        name="Contract Details"
        onFinish={onFinish}
        validateTrigger="onBlur"
        layout="vertical"
        initialValues={initialValues}
        scrollToFirstError={true}
        form={form}
      >
        <Row gutter={24}>
          <Col span={24} md={8}>
            <Form.Item
              name="address"
              label={t(translations.contractVerification.contractAddress)}
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
                      isCoreContractAddress(address, false) &&
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
                  translations.contractVerification.placeholder.contractAddress,
                )}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item
              name="codeFormat"
              label={t(translations.contractVerification.compilerType)}
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
                  translations.contractVerification.error.pleaseSelect,
                )}
                onChange={value => {
                  setCodeFormat(value as string);
                  form.setFieldsValue({
                    compiler: undefined,
                  });
                }}
              >
                {codeFormats.map(l => (
                  <Option value={l.key} key={l.key}>
                    {l.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item
              name="compiler"
              label={t(translations.contractVerification.compilerVersion)}
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
                  translations.contractVerification.error.pleaseSelect,
                )}
              >
                {compilers.map(l => (
                  <Option value={l.key} key={l.key}>
                    {l.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <StyledButtonWrapper>
          <Button
            type="default"
            loading={loading}
            className="submit-button"
            onClick={() => form.resetFields()}
          >
            {t(translations.contractVerification.button.reset)}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="submit-button"
          >
            {t(translations.contractVerification.button.continue)}
          </Button>
        </StyledButtonWrapper>
      </Form>
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
    </>
  );
};
