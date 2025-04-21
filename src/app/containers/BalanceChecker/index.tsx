import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import styled from 'styled-components';
import { Button, Divider, Form, Input } from '@cfxjs/antd';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@cfxjs/sirius-next-common/dist/components/PageHeader';
import { Radio } from '@cfxjs/sirius-next-common/dist/components/Radio';
import { DatePicker } from '@cfxjs/react-ui';
import { translations } from 'locales/i18n';
import {
  isCurrentNetworkAddress,
  isCoreContractAddress,
  isZeroOrPositiveInteger,
  getAddressInputPlaceholder,
} from '../../../utils';
import { Result } from './Result';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import querystring from 'query-string';

export function BalanceChecker() {
  const { search } = useLocation();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState('3');
  const [toggle, setToggle] = useState(true);
  const [resultVisible, setResultVisible] = useState('none');
  const [formData, setFormData] = useState({});

  const options = useMemo(
    () => [
      {
        label: t(translations.balanceChecker.cfxBalance),
        value: '3',
      },
    ],
    [t],
  );

  const addressInputPlaceholder = useMemo(() => {
    return getAddressInputPlaceholder();
  }, []);

  useEffect(() => {
    form
      .validateFields(['blockNo'])
      .then(res => {})
      .catch(err => {});
  }, [toggle, form]);

  const onChangeRadio = e => {
    resetForm();
    setRadioValue(e.target.value);
    setResultVisible('none');
  };
  const onChangeAccountAddress = e => {
    form.setFieldsValue({ accountAddress: e.target.value });
  };
  const onChangeContractAddress = e => {
    form.setFieldsValue({ contractAddress: e.target.value });
  };
  const onChangeDate = dateObject => {
    form.setFieldsValue({ date: dateObject, blockNo: '' });
    setToggle(true);
  };
  const onChangeBlockNo = e => {
    if (isZeroOrPositiveInteger(e.target.value)) {
      form.setFieldsValue({ blockNo: e.target.value });
      setToggle(false);
    }
  };
  const onFocusBlockNoInput = () => {
    form.setFieldsValue({ date: '' });
  };
  const onClickLookUp = e => {
    form
      .validateFields()
      .then(values => {
        if (values.date !== '') {
          values.date = values.date.format('YYYY-MM-DD');
        }
        setFormData({
          accountBase32: values.address,
          epoch: values.blockNo,
          dt: values.date,
        });
        setResultVisible('block');
      })
      .catch(error => {});
  };
  const onClickReset = e => {
    resetForm();
    setResultVisible('none');
  };
  const resetForm = () => {
    form.resetFields();
  };
  const validateAddress = (rule, address) => {
    if (address && !isCurrentNetworkAddress(address)) {
      return Promise.reject(
        new Error(t(translations.addressConverter.incorrectFormat)),
      );
    }
    return Promise.resolve();
  };
  const validateContractAddress = (rule, contractAddress) => {
    if (contractAddress && !isCoreContractAddress(contractAddress, false)) {
      return Promise.reject(
        new Error(t(translations.contract.invalidContractAddress)),
      );
    }
    return Promise.resolve();
  };
  const validateEpochIsNumber = (rule, epoch) => {
    if (epoch && !isZeroOrPositiveInteger(epoch)) {
      return Promise.reject(
        new Error(t(translations.balanceChecker.invalidEpochNo)),
      );
    }
    return Promise.resolve();
  };
  const disabledDate = (currentDate: dayjs.Dayjs) => {
    if (dayjs.isDayjs(currentDate)) {
      return currentDate.unix() > dayjs().unix();
    }
  };
  const validateMessages = {
    required: t(translations.balanceChecker.error),
  };

  const AccountAddressFormItem = (
    <Form.Item
      label={t(translations.balanceChecker.address)}
      name="address"
      rules={[{ required: true }, { validator: validateAddress }]}
      initialValue={querystring.parse(search).address}
    >
      <Input
        allowClear
        onChange={onChangeAccountAddress}
        placeholder={addressInputPlaceholder}
      />
    </Form.Item>
  );
  const ContractAddressFormItem = (
    <Form.Item
      label={t(translations.balanceChecker.contractAddress)}
      name="contractAddress"
      rules={[{ required: true }, { validator: validateContractAddress }]}
    >
      <Input allowClear onChange={onChangeContractAddress} />
    </Form.Item>
  );
  const BlockNoOrDateFormItem = (
    <Form.Item
      required
      label={t(translations.balanceChecker.epochNoOrDate)}
      style={{ marginBottom: 0 }}
    >
      <Form.Item
        name={'date'}
        rules={[{ required: toggle }]}
        style={{ display: 'inline-block', width: '23%' }}
      >
        <DatePicker
          style={{ height: '32px', width: '300px' }}
          color="primary"
          variant="solid"
          // @ts-ignore
          placeholder={t(translations.balanceChecker.chooseDate)}
          locale={i18n.language}
          // @ts-ignore
          format={['MM-DD-YYYY', 'M-D-YYYY', 'YYYY-MM-DD', 'YYYY-M-D']}
          onChange={onChangeDate}
          // @ts-ignore
          disabledDate={disabledDate}
        />
      </Form.Item>
      <Form.Item
        style={{ display: 'inline-block', width: '3%', textAlign: 'center' }}
      >
        <Or>{t(translations.balanceChecker.or)}</Or>
      </Form.Item>
      <Form.Item
        name={'blockNo'}
        rules={[{ required: !toggle }, { validator: validateEpochIsNumber }]}
        style={{ display: 'inline-block', width: '74%' }}
      >
        <Input
          allowClear
          placeholder={t(translations.balanceChecker.enterEpochNo)}
          onFocus={onFocusBlockNoInput}
          onChange={onChangeBlockNo}
        />
      </Form.Item>
    </Form.Item>
  );

  const TokenBalanceForm = (
    <Form layout={'vertical'} form={form} validateMessages={validateMessages}>
      {AccountAddressFormItem}
      {ContractAddressFormItem}
      {BlockNoOrDateFormItem}
    </Form>
  );
  const TokenSupplyForm = (
    <Form layout={'vertical'} form={form} validateMessages={validateMessages}>
      {ContractAddressFormItem}
      {BlockNoOrDateFormItem}
    </Form>
  );
  const CFXForm = (
    <Form layout={'vertical'} form={form} validateMessages={validateMessages}>
      {AccountAddressFormItem}
      {BlockNoOrDateFormItem}
    </Form>
  );

  let formComp = <></>;
  if (radioValue === '1') {
    formComp = TokenBalanceForm;
  } else if (radioValue === '2') {
    formComp = TokenSupplyForm;
  } else if (radioValue === '3') {
    formComp = CFXForm;
  }

  return (
    <>
      <Helmet>
        <title>{t(translations.balanceChecker.tokenBalanceChecker)}</title>
      </Helmet>

      <PageHeader subtitle={t(translations.balanceChecker.subtitle)}>
        {t(translations.balanceChecker.tokenBalanceChecker)}
      </PageHeader>

      <CardWrap>
        <Card className={`sirius-list-card`}>
          <RadioGroup>
            <Radio
              options={options}
              value={radioValue}
              onChange={onChangeRadio}
            />
          </RadioGroup>
          <Divider />
          {formComp}
          <ButtonGroup>
            <Button type="primary" onClick={onClickLookUp}>
              {t(translations.balanceChecker.lookUp)}
            </Button>
            <Button type="primary" className={'reset'} onClick={onClickReset}>
              {t(translations.balanceChecker.reset)}
            </Button>
          </ButtonGroup>
          <Result
            radioValue={radioValue}
            resultVisible={resultVisible}
            formData={formData}
          />
        </Card>
      </CardWrap>
    </>
  );
}

const ButtonGroup = styled.div`
  .ant-btn {
    width: 133px;
    margin-right: 8px;
    font-weight: 500;
    margin-bottom: 24px;
  }

  button.reset {
    color: #424a71;
    background: rgba(30, 61, 228, 0.1);
    border-color: transparent;
  }
`;

const RadioGroup = styled.div`
  padding: 24px 0 0 0;
`;

const Or = styled.div`
  color: #002257;
  font-weight: 450;
`;

const CardWrap = styled.div`
  font-family: 'Circular Std', 'PingFang SC', -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 450;

  .ant-radio-wrapper,
  .ant-form-item-label > label {
    color: #002257;
  }

  .ant-input {
    color: #97a3b4;
  }

  .cfx-picker-input > input {
    color: #7f8699;
    font-weight: 500;
  }

  .ant-form-item-required {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;

    &::before {
      margin-left: 2px;
    }
  }

  .ant-input-number {
    width: 100%;
  }

  .ant-input-number-handler-wrap {
    display: none;
  }
`;
