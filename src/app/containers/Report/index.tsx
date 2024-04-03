import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from 'app/components/PageHeader/Loadable';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Form, Input, Checkbox, Button, Row, Col } from '@cfxjs/antd';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { isHash, isCurrentNetworkAddress } from 'utils';
import ReCAPTCHA from 'react-google-recaptcha';
import { reqReport } from 'utils/httpRequest';
import { useMessages } from '@cfxjs/react-ui';
// import { IS_TESTNET } from 'utils/constants';
// import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

const checkboxStyle = { lineHeight: '2.2857rem', width: '9.1429rem' };

export function Report() {
  const [form] = Form.useForm();
  const [, setMessage] = useMessages();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [recaptcha, setRecaptcha] = useState(false);
  const [loading, setLoading] = useState(false);

  const search = {
    address: '',
    ...queryString.parse(location.search),
  };
  const addressInitalValue = isCurrentNetworkAddress(search['address'])
    ? search['address']
    : '';

  const onFinish = (values: any) => {
    setLoading(true);
    reqReport(values)
      .then(({ report }) => {
        if (report !== 'ok') {
          throw new Error(t(translations.report.status.fail));
        } else {
          setMessage({
            text: t(translations.report.status.success),
            color: 'success',
          });
          form.resetFields();
        }
      })
      .catch(e => {
        setMessage({
          text: t(translations.report.status.fail),
          color: 'error',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChange = value => {
    if (value) {
      setRecaptcha(true);
    } else {
      setRecaptcha(false);
    }
  };

  const lang = i18n.language.indexOf('en') > -1 ? 'en' : 'zh';

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
        validateTrigger="onBlur"
        layout="vertical"
        initialValues={{
          address: addressInitalValue,
        }}
        scrollToFirstError={true}
        form={form}
      >
        <Form.Item
          name="address"
          label={t(translations.report.address)}
          rules={[
            {
              required: true,
              message: t(translations.report.error.addressRequired),
            },
            () => ({
              validator(_, value) {
                const address = value.trim().toLowerCase();
                const textInvalidAddress = t(
                  translations.report.error.addressInvalid,
                );

                if (isCurrentNetworkAddress(address)) {
                  return Promise.resolve();
                } else {
                  return Promise.reject(textInvalidAddress);
                }

                // @todo, add more detail tip

                // const textInvalidMainnetAddress = t(
                //   translations.report.error.isNotMainnet,
                // );
                // const textInvalidTestnetAddress = t(
                //   translations.report.error.isNotTestnet,
                // );

                // if (address.startsWith('0x')) {
                //   if (isCurrentNetworkAddress(address)) {
                //     return Promise.resolve();
                //   } else {
                //     return Promise.reject(textInvalidAddress);
                //   }
                // } else if (IS_TESTNET) {
                //   if (!address.startsWith('cfxtest:')) {
                //     return Promise.reject(textInvalidTestnetAddress);
                //   } else if (SDK.address.isValidCfxAddress(address)) {
                //     return Promise.resolve();
                //   } else {
                //     return Promise.reject(textInvalidAddress);
                //   }
                // } else if (!IS_TESTNET) {
                //   if (!address.startsWith('cfx:')) {
                //     return Promise.reject(textInvalidMainnetAddress);
                //   } else if (SDK.address.isValidCfxAddress(address)) {
                //     return Promise.resolve();
                //   } else {
                //     return Promise.reject(textInvalidAddress);
                //   }
                // } else {
                //   return Promise.reject(textInvalidAddress);
                // }
              },
            }),
          ]}
          validateFirst
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="txn_hash"
          label={t(translations.report.txnHash)}
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
        <Form.Item
          name="type"
          label={t(translations.report.selectType)}
          rules={[
            {
              required: true,
              message: t(translations.report.error.typeRequired),
            },
          ]}
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
          name="token"
          rules={[
            () => ({
              validator() {
                if (recaptcha) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t(translations.report.error.recaptchaRequired)),
                );
              },
            }),
          ]}
        >
          <ReCAPTCHA
            sitekey="6LeSnTofAAAAAML11Df2KzLagoDb59fhVWb8ENSc"
            onChange={onChange}
            hl={lang}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t(translations.report.submit)}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
