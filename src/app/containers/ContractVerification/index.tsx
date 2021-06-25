import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { Remark } from 'app/components/Remark';
import styled from 'styled-components/macro';
import { Card } from 'app/components/Card/Loadable';
import { Form, Input, Button, Row, Col } from '@jnoodle/antd';
import {
  validateAddress,
  isHash,
  ValidateContractAddressReturnProps,
} from 'utils';

export const ContractVerification = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // @todo submit form
    setLoading(false);
    console.log('finish');
  };

  // const onChange = value => {
  //   console.log('on change');
  // };

  return (
    <StyledContractVerificationWrapper>
      <Helmet>
        <title>{t(translations.contractVerification.title)}</title>
        <meta
          name="description"
          content={t(translations.contractVerification.description)}
        />
      </Helmet>
      <PageHeader subtitle={t(translations.contractVerification.tip)}>
        {t(translations.contractVerification.title)}
      </PageHeader>
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
                rules={[
                  {
                    required: true,
                    message: t(
                      translations.contractVerification.error.required,
                    ),
                  },
                  () => ({
                    validator(_, value) {
                      const textInvalidAddress = t(
                        translations.contractVerification.error.isNotAddress,
                      );
                      const textInvalidMainnetAddress = t(
                        translations.contractVerification.error.isNotMainnet,
                      );
                      const textInvalidTestnetAddress = t(
                        translations.contractVerification.error.isNotTestnet,
                      );

                      const info: ValidateContractAddressReturnProps = validateAddress(
                        value.trim(),
                        true,
                      );

                      if (typeof info !== 'boolean') {
                        if (info.status === 'valid') {
                          return Promise.resolve();
                        } else {
                          if (['3', '4', '7'].includes(info.type)) {
                            return Promise.reject(
                              new Error(textInvalidAddress),
                            );
                          } else if (info.type === '5') {
                            return Promise.reject(
                              new Error(textInvalidMainnetAddress),
                            );
                          } else if (info.type === '6') {
                            return Promise.reject(
                              new Error(textInvalidTestnetAddress),
                            );
                          }
                        }
                      } else {
                        return info ? Promise.resolve() : Promise.reject();
                      }
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="runs"
                label={t(translations.contractVerification.runs)}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (isHash(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t(translations.report.error.txnHashInvalid)),
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contractNameTag"
                label={t(translations.contractVerification.contractNameTag)}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (isHash(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t(translations.report.error.txnHashInvalid)),
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="compiler"
                label={t(translations.contractVerification.compiler)}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (isHash(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t(translations.report.error.txnHashInvalid)),
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="optimization"
                label={t(translations.contractVerification.optimization)}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (isHash(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t(translations.report.error.txnHashInvalid)),
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="license"
                label={t(translations.contractVerification.license)}
                rules={[
                  () => ({
                    validator(_, value) {
                      if (isHash(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t(translations.report.error.txnHashInvalid)),
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="contractSourceCode"
            label={t(translations.contractVerification.contractSourceCode)}
            rules={[
              {
                required: true,
                message: t(translations.report.error.descriptionRequired),
              },
              {
                min: 30,
                max: 200,
                message: t(translations.report.error.descriptionRequired),
              },
            ]}
            validateFirst
          >
            <Input.TextArea
              showCount
              allowClear
              autoSize={{ minRows: 6, maxRows: 6 }}
              maxLength={200}
              placeholder={t(translations.report.tip)}
            />
          </Form.Item>
          <Form.Item
            style={{
              marginBottom: 0,
            }}
          >
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
  margin-top: 24px;
`;

const StyledContractVerificationWrapper = styled.div`
  .card.contract-verification-form-container {
    padding: 12px 20px 18px 20px;
  }
`;
