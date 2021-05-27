import React, { useState } from 'react';
import { Card } from '../../components/Card';
import styled from 'styled-components/macro';
import {
  Avatar,
  Button,
  Card as AntdCard,
  Divider,
  Form,
  Input,
  Radio,
} from '@jnoodle/antd';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { PageHeader } from '../../components/PageHeader/Loadable';
import { DatePicker } from '@cfxjs/react-ui';
import { translations } from '../../../locales/i18n';
import TokenIcon from 'images/balance-checker/token-icon.png';
import BlockIcon from 'images/balance-checker/block.png';
import DateIcon from 'images/balance-checker/date.png';
import SuccessIcon from 'images/balance-checker/success.png';
import { formatNumber, isAddress, isContractAddress } from '../../../utils';
import { Text } from '../../components/Text/Loadable';
import dayjs from 'dayjs';

export function BalanceChecker() {
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const [radioValue, setRadioValue] = useState(1);
  const [toggle, setToggle] = useState(true);
  const [resultVisible, setResultVisible] = useState('none');
  const datePlaceholder = [
    t(translations.general.startDate),
    t(translations.general.endDate),
  ];

  React.useEffect(() => {
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
  const onChangeDate = (newDates, dateStrings) => {
    form.setFieldsValue({ date: newDates, blockNo: '' });
    if (dateStrings !== []) {
      setToggle(true);
    }
  };
  const onChangeBlockNo = e => {
    form.setFieldsValue({ blockNo: e.target.value });
    setToggle(false);
  };
  const onFocusBlockNoInput = () => {
    form.setFieldsValue({ date: [] });
  };
  const onClickLookUp = e => {
    form
      .validateFields()
      .then(values => {
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
    if (address && !isAddress(address)) {
      return Promise.reject(
        new Error(t(translations.addressConverter.incorrectFormat)),
      );
    }
    return Promise.resolve();
  };
  const validateContractAddress = (rule, contractAddress) => {
    if (contractAddress && !isContractAddress(contractAddress)) {
      return Promise.reject(
        new Error(t(translations.contract.invalidContractAddress)),
      );
    }
    return Promise.resolve();
  };

  const validateMessages = {
    required: t(translations.balanceChecker.error),
  };

  const AccountAddressFormItem = (
    <Form.Item
      label={t(translations.balanceChecker.address)}
      name="address"
      rules={[{ required: true }, { validator: validateAddress }]}
    >
      <Input allowClear onChange={onChangeAccountAddress} />
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
      label={t(translations.balanceChecker.blockNoOrDate)}
      style={{ marginBottom: 0 }}
    >
      <Form.Item
        name={'date'}
        rules={[{ required: toggle }]}
        style={{ display: 'inline-block', width: '23%' }}
      >
        <DatePicker.RangePicker
          style={{ height: '32px' }}
          color="primary"
          variant="solid"
          // @ts-ignore
          placeholder={datePlaceholder}
          format={'MM-DD-YYYY'}
          onChange={onChangeDate}
        />
      </Form.Item>
      <Form.Item
        style={{ display: 'inline-block', width: '3%', textAlign: 'center' }}
      >
        <Or>{t(translations.balanceChecker.or)}</Or>
      </Form.Item>
      <Form.Item
        name={'blockNo'}
        rules={[{ required: !toggle }]}
        style={{ display: 'inline-block', width: '74%' }}
      >
        <Input
          allowClear
          placeholder={t(translations.balanceChecker.enterBlockNo)}
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
  const TokenQuantityCard = (
    <AntdCard.Meta
      avatar={<Avatar src={TokenIcon} />}
      title={t(translations.balanceChecker.tokenQuantity)}
      description={
        // todo 添加单位
        <Text hoverValue={'9441614704711111.123456789'}>
          {formatNumber('9441614704711111.123456789', {
            precision: 6,
            withUnit: false,
          })}
        </Text>
      }
    />
  );
  const CFXCard = (
    <AntdCard.Meta
      avatar={<Avatar src={TokenIcon} />}
      title={t(translations.balanceChecker.cfxBalance)}
      description={
        <Text hoverValue={'9441614704711111.123456789'}>
          {formatNumber(9441614704711111.123456789, {
            precision: 6,
            withUnit: false,
          })}
          CFX
        </Text>
      }
    />
  );

  let formComp = <></>;
  if (radioValue === 1) {
    formComp = TokenBalanceForm;
  } else if (radioValue === 2) {
    formComp = TokenSupplyForm;
  } else if (radioValue === 3) {
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
            <Radio.Group onChange={onChangeRadio} value={radioValue}>
              <Radio value={1}>
                {t(translations.balanceChecker.tokenQuantity)}
              </Radio>
              <Radio value={2}>
                {t(translations.balanceChecker.tokenSupply)}
              </Radio>
              <Radio value={3}>
                {t(translations.balanceChecker.cfxBalance)}
              </Radio>
            </Radio.Group>
          </RadioGroup>
          <Divider />
          {formComp}
        </Card>
      </CardWrap>

      <ButtonGroup>
        <Button type="primary" onClick={onClickLookUp}>
          {t(translations.balanceChecker.lookUp)}
        </Button>
        <Button type="primary" className={'reset'} onClick={onClickReset}>
          {t(translations.balanceChecker.reset)}
        </Button>
      </ButtonGroup>

      {/*todo 增加网络请求*/}
      <ResultWrap
        // @ts-ignore
        visible={resultVisible}
      >
        <Card>
          <TopLine>
            <TopLineTitle>
              <img src={SuccessIcon} alt={''} />
              {t(translations.balanceChecker.tokenQuantityForAccountAddress)}：
            </TopLineTitle>
            <TopLineValue>
              {
                '0x832cc5618eaa0caa90fa067d8c122d55d7d9c68e74b502939e158e0377c11c8b'
              }
            </TopLineValue>
          </TopLine>
          <CardGroup>
            <AntdCard>
              <AntdCard.Meta
                avatar={<Avatar src={DateIcon} />}
                title={t(translations.balanceChecker.snapshotDate)}
                description={
                  i18n.language.indexOf('en') > -1
                    ? dayjs().format('MMM DD,YYYY')
                    : dayjs().format('YYYY-MM-DD')
                }
              />
            </AntdCard>
            <AntdCard>
              <AntdCard.Meta
                avatar={<Avatar src={BlockIcon} />}
                title={t(translations.balanceChecker.block)}
                description={'12345678'}
              />
            </AntdCard>
            <AntdCard>
              {radioValue === 1 || radioValue === 2
                ? TokenQuantityCard
                : CFXCard}
            </AntdCard>
          </CardGroup>
        </Card>
      </ResultWrap>
    </>
  );
}

const CardGroup = styled.div`
  display: flex;

  .ant-card {
    margin: 0 24px 32px 0;

    .ant-card-meta-title {
      font-size: 14px;
    }

    .ant-card-meta {
      display: flex;
      flex-direction: row-reverse;

      .ant-card-meta-avatar {
        margin-left: 24px;
        padding: 0;

        .ant-avatar {
          width: 48px;
          height: 48px;
          background: #f5f6fa;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 60%;
            height: 60%;
          }
        }
      }

      .ant-card-meta-description {
        width: 190px;

        p {
          font-weight: 450;
        }
      }
    }
  }
`;

const TopLineTitle = styled.span`
  color: #002257;

  img {
    margin-right: 4px;
  }
`;
const TopLineValue = styled.span`
  color: #97a3b4;
`;
const TopLine = styled.div`
  padding: 24px 0;
`;

const ResultWrap = styled.div`
  font-family: 'Circular Std', 'PingFang SC', -apple-system, BlinkMacSystemFont,
    'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
    'Droid Sans', 'Helvetica Neue', sans-serif;
  font-weight: 450;

  // @ts-ignore
  display: ${props => props.visible};
`;

const ButtonGroup = styled.div`
  margin: 24px 0;

  .ant-btn {
    width: 133px;
    margin-right: 8px;
    font-weight: 500;
  }

  .reset {
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
`;
