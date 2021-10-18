import React, { useState, useEffect } from 'react';
import {
  isSafeNumberOrNumericStringInput,
  formatBalance,
  formatNumber,
} from 'utils';
import styled from 'styled-components/macro';
import { Input, Image } from '@cfxjs/react-ui';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { Button } from 'app/components/Button/Loadable';
import { StyledTitle160F1327 } from 'app/components/StyledComponent';
import { usePortal } from 'utils/hooks/usePortal';
import { ConnectButton } from 'app/components/ConnectWallet';
import BigNumber, { BigNumber as IBigNumber } from 'bignumber.js';

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
}

const isInvalidInput = str => {
  const fStr = formatNumber(str, {
    precision: 18,
  });
  return fStr === '' || fStr === '0';
};

export const ActionField = ({
  readonly,
  tokenType,
  title,
  balance = new BigNumber('0'),
  showBalance = true,
  value,
  buttonText,
  tip = '',
  onInputChange = () => {},
  onButtonClick = () => {},
}: ActionFieldProps) => {
  const { t } = useTranslation();
  const { accounts } = usePortal();
  const [buttonDisabled, setButtonDisabled] = useState(isInvalidInput(value));

  useEffect(() => {
    const disabled = isInvalidInput(value);
    if (disabled !== buttonDisabled) {
      setButtonDisabled(isInvalidInput(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const b = accounts.length
    ? formatBalance(balance, 18, false, {}, '0.001')
    : '--';

  const handleInputChange = e => {
    let value = e.target.value;

    if (value === '' || isSafeNumberOrNumericStringInput(value)) {
      const decimal = value.split('.')[1];

      if (decimal && decimal.length >= MAX_DECIMALS) {
        return;
      } else {
        onInputChange(value);

        if (new BigNumber(value).gt(balance.dividedBy(MODULE))) {
          setButtonDisabled(true);
        } else {
          setButtonDisabled(false);
        }
      }
    }
  };

  const handleMax = () => {
    onInputChange(balance.dividedBy(MODULE));
  };

  const disabled =
    accounts.length &&
    ((showBalance && balance.lt(new BigNumber(value).multipliedBy(MODULE))) ||
      buttonDisabled);

  return (
    <StyledActionFieldWrapper>
      <StyledTitle160F1327>{title}</StyledTitle160F1327>
      <div className="fccfx-actionField-container">
        <div className="fccfx-actionField-inputContainer">
          <Input
            placeholder="0.0"
            value={value}
            size="small"
            onChange={handleInputChange}
            style={{ width: '100%', height: '32px' }}
            className="fccfx-actionField-input"
            disabled={readonly}
          ></Input>
          {showBalance ? (
            <span className="fccfx-actionField-tip">
              {tip}
              {b}
            </span>
          ) : null}
          <div className="fccfx-actionField-assistContainer">
            {readonly ? null : (
              <div className="fccfx-actionField-max" onClick={handleMax}>
                {t(translations.fccfx.max)}
              </div>
            )}
            <div className="fccfx-actionField-tokenIcon">
              {tokenType === 'fc' ? <Image src={iconFC}></Image> : null}
              {tokenType === 'cfx' ? <Image src={iconCFX}></Image> : null}
            </div>
            <div className="fccfx-actionField-tokenName">
              {tokenType.toUpperCase()}
            </div>
          </div>
        </div>
        <div>
          <ConnectButton>
            <Button
              type={disabled ? '' : 'primary'}
              onClick={onButtonClick}
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

const StyledActionFieldWrapper = styled.div`
  margin-top: 10px;

  .fccfx-actionField-container {
    display: flex;
  }

  .fccfx-actionField-inputContainer {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    div.input-wrapper.disabled {
      background-color: #f5f5f5;
    }

    .fccfx-actionField-input {
      width: 100%;
      height: 32px;
      padding-right: 10px;
    }

    .fccfx-actionField-assistContainer {
      position: absolute;
      display: flex;
      height: 32px;
      justify-content: center;
      align-items: center;
      right: 20px;

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
      padding-right: 10px;
      margin-top: 4px;
    }
  }

  .fccfx-actionField-button {
    min-width: 124px;
  }
`;
