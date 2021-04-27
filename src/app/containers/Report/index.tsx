import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Form, Input, Checkbox, Button, Row, Col } from '@jnoodle/antd';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { isContractAddress } from 'utils';

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!',
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const checkboxStyle = { lineHeight: '32px', width: '128px' };

export function Report() {
  const { t } = useTranslation();
  const location = useLocation();
  const search = {
    'contract-address': '',
    ...queryString.parse(location.search),
  };
  const addressInitalValue = isContractAddress(search['contract-address'])
    ? search['contract-address']
    : '';

  const onFinish = (values: any) => {
    console.log(values);
  };

  return (
    <>
      <Helmet>
        <title>{t(translations.report.title)}</title>
        <meta name="description" content={t(translations.report.title)} />
      </Helmet>
      <PageHeader subtitle={t(translations.report.subtitle)}>
        {t(translations.report.title)}
      </PageHeader>
      <Form
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
        layout="vertical"
        initialValues={{
          address: addressInitalValue,
        }}
      >
        <Form.Item
          name="address"
          label={t(translations.report.address)}
          rules={[
            { required: true },
            () => ({
              validator(_, value) {
                if (isContractAddress(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t(translations.report.addressError)),
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="checkbox-group"
          label={t(translations.report.selectType)}
          rules={[{ required: true }]}
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row>
              <Col>
                <Checkbox
                  value={t(translations.report.phishHack)}
                  style={checkboxStyle}
                >
                  {t(translations.report.phishHack)}
                </Checkbox>
              </Col>
              <Col>
                <Checkbox
                  value={t(translations.report.scam)}
                  style={checkboxStyle}
                >
                  {t(translations.report.scam)}
                </Checkbox>
              </Col>
              <Col>
                <Checkbox
                  value={t(translations.report.fishy)}
                  style={checkboxStyle}
                >
                  {t(translations.report.fishy)}
                </Checkbox>
              </Col>
              <Col>
                <Checkbox
                  value={t(translations.report.highRisk)}
                  style={checkboxStyle}
                >
                  {t(translations.report.highRisk)}
                </Checkbox>
              </Col>
              <Col>
                <Checkbox
                  value={t(translations.report.spam)}
                  style={checkboxStyle}
                >
                  {t(translations.report.spam)}
                </Checkbox>
              </Col>
              <Col>
                <Checkbox
                  value={t(translations.report.others)}
                  style={checkboxStyle}
                >
                  {t(translations.report.others)}
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Form.Item
          name="description"
          label={t(translations.report.description)}
          rules={[
            {
              required: true,
              min: 30,
              max: 200,
              message: t(translations.report.tip),
            },
          ]}
        >
          <Input.TextArea
            showCount
            allowClear
            autoSize={{ minRows: 6, maxRows: 6 }}
            maxLength={200}
            placeholder={t(translations.report.tip)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t(translations.report.submit)}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
