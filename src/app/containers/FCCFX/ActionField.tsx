import React, { useEffect } from 'react';
import { isSafeNumberOrNumericStringInput, formatBalance } from 'utils';
import styled from 'styled-components';
import { Image } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Button } from 'app/components/Button/Loadable';
import { StyledTitle160F1327 } from 'app/components/StyledComponent';
import { usePortal } from 'utils/hooks/usePortal';
import { ConnectButton } from 'app/components/ConnectWallet';
import BigNumber, { BigNumber as IBigNumber } from 'bignumber.js';
import { Input, Form } from '@cfxjs/antd';

import iconCFX from 'images/icon/cfx.svg';
import iconFC from 'images/icon/fc.svg';

// token decimal
const MAX_DECIMALS = 18;
const MODULE = 10 ** MAX_DECIMALS;

interface ActionFieldProps {
  readonly?: boolean;
  tokenType: string;
  title: string;
  balance?: IBigNumber;
  showBalance?: boolean;
  value: string;
  buttonText: string;
  tip?: string;
  onInputChange?: (value) => void;
  onButtonClick: (value) => void;
  inactiveButtonDisabled?: boolean;
  style?: React.CSSProperties;
}

const isZeroInput = str => new BigNumber(str).eq(0);

export const ActionField = ({
  readonly = false,
  tokenType,
  title,
  balance = new BigNumber('0'),
  showBalance = true,
  value,
  buttonText,
  tip = '',
  onInputChange = () => {},
  onButtonClick = () => {},
  inactiveButtonDisabled,
  style,
}: ActionFieldProps) => {
  const { t } = useTranslation();
  const { accounts } = usePortal();
  const [form] = Form.useForm();

  const b = accounts.length
    ? formatBalance(
        balance,
        18,
        false,
        {
          withUnit: false,
        },
        '0.001',
      )
    : '--';

  // if inactive is true, not check other condition
  const disabled = inactiveButtonDisabled
    ? false
    : (accounts.length &&
        showBalance &&
        balance.lt(new BigNumber(value).multipliedBy(MODULE))) ||
      isZeroInput(value);

  useEffect(() => {
    const iValue = readonly
      ? formatBalance(
          new BigNumber(value).multipliedBy(MODULE),
          18,
          false,
          {
            withUnit: false,
          },
          '0.001',
        )
      : value;

    form.setFieldsValue({
      input: iValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleInputChange = e => {
    let value = e.target.value;

    if (value === '' || isSafeNumberOrNumericStringInput(value)) {
      const decimal = value.split('.')[1];

      if (decimal && decimal.length >= MAX_DECIMALS) {
        return;
      } else {
        onInputChange(value);
      }
    }
  };

  const handleMax = () => {
    onInputChange(balance.dividedBy(MODULE));
  };

  const handleButtonClick = () => form.submit();

  const handleFinish = () => onButtonClick(null);

  const onFinishFailed = (errorInfo: any) => console.log('Failed:', errorInfo);

  return (
    <StyledActionFieldWrapper style={style} readonly={readonly}>
      <StyledTitle160F1327>{title}</StyledTitle160F1327>
      <div className="fccfx-actionField-container">
        <div className="fccfx-actionField-inputContainer">
          <Form
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 23 }}
            initialValues={{ remember: true }}
            onFinish={handleFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
          >
            <Form.Item
              label=""
              name="input"
              extra={
                showBalance ? (
                  <span className="fccfx-actionField-tip">
                    {tip}
                    {b}
                  </span>
                ) : null
              }
              rules={[
                { required: true, message: t(translations.fccfx.tip.required) },
              ]}
            >
              <Input
                placeholder="0.0"
                size="small"
                onChange={handleInputChange}
                className="fccfx-actionField-input"
                disabled={readonly}
                suffix={
                  <>
                    <div className="fccfx-actionField-assistContainer">
                      {readonly ? null : (
                        <div
                          className="fccfx-actionField-max"
                          onClick={handleMax}
                        >
                          {t(translations.fccfx.max)}
                        </div>
                      )}
                      <div className="fccfx-actionField-tokenIcon">
                        {tokenType === 'fc' ? (
                          <Image src={iconFC}></Image>
                        ) : null}
                        {tokenType === 'cfx' ? (
                          <Image src={iconCFX}></Image>
                        ) : null}
                      </div>
                      <div className="fccfx-actionField-tokenName">
                        {tokenType.toUpperCase()}
                      </div>
                    </div>
                  </>
                }
              ></Input>
            </Form.Item>
          </Form>
        </div>
        <div>
          <ConnectButton>
            <Button
              type={disabled ? undefined : 'primary'}
              onClick={handleButtonClick}
              disabled={disabled}
            >
              {buttonText}
            </Button>
          </ConnectButton>
        </div>
      </div>
    </StyledActionFieldWrapper>
  );
};

const StyledActionFieldWrapper = styled.div<{
  readonly: boolean;
}>`
  .fccfx-actionField-container {
    display: flex;
    min-height: ${props => (props.readonly ? '' : '58px')};
  }

  form.ant-form > .ant-form-item {
    margin-bottom: 0;

    .ant-form-item-extra {
      position: absolute;
      right: 0;
      top: 30px;
    }

    .ant-form-item-explain {
      font-size: 12px;
    }
  }

  .fccfx-actionField-inputContainer {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    div.input-wrapper.disabled {
      background-color: #f5f5f5;
    }

    input.ant-input {
      height: 32px;
    }

    .fccfx-actionField-assistContainer {
      display: flex;
      justify-content: center;
      align-items: center;

      .fccfx-actionField-max {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 51px;
        height: 20px;
        background: #fede1b;
        border-radius: 2px;
        font-size: 14px;
        color: #65709a;
        line-height: 18px;
        margin-right: 8px;
        cursor: pointer;
      }

      .fccfx-actionField-tokenIcon {
        width: 20px;
        height: 20px;
        margin-right: 4px;
      }

      .fccfx-actionField-tokenName {
        font-size: 20px;
        color: #424242;
        line-height: 20px;
      }
    }

    .fccfx-actionField-tip {
      font-size: 12px;
      color: #8890a4;
      line-height: 18px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      margin-top: 4px;
    }
  }

  .fccfx-actionField-button {
    min-width: 124px;
  }
`;
