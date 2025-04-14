import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { usePortal } from 'utils/hooks/usePortal';
import { abi } from 'utils/contract/wcfx.json';
import { TXN_ACTION, CONTRACTS, NETWORK_ID } from 'utils/constants';
import { isSafeNumberOrNumericStringInput, formatNumber } from 'utils';
import { useTxnHistory } from 'utils/hooks/useTxnHistory';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { StyledCard as Card } from '@cfxjs/sirius-next-common/dist/components/Card';
import styled from 'styled-components';
import { ConnectButton } from 'app/components/ConnectWallet';
import { Select } from '@cfxjs/sirius-next-common/dist/components/Select';
import Button from '@cfxjs/sirius-next-common/dist/components/Button';
import { Input } from '@cfxjs/react-ui';
import { Tooltip } from '@cfxjs/sirius-next-common/dist/components/Tooltip';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { media } from '@cfxjs/sirius-next-common/dist/utils/media';
import { TxnStatusModal } from 'app/components/ConnectWallet/TxnStatusModal';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';

import imgSwapArrowDown from 'images/swap-arrow-down.png';
import imgInfo from 'images/info.svg';
import ENV_CONFIG from 'env';

// token decimal
const MAX_DECIMALS = 18;
const MAX_FORMAT_DECIMALS = 6;

interface SwapItemProps {
  type: string;
  selected: string;
  value: string;
  balance: string;
  onSelectChange: (value) => void;
  onInputChange: (value) => void;
}

const SwapItem = ({
  type,
  selected,
  value,
  balance,
  onInputChange,
  onSelectChange,
}: SwapItemProps) => {
  const { t } = useTranslation();

  let title = t(translations.swap.from);
  let balanceTitle: React.ReactNode = t(translations.swap.balance);

  if (selected === 'cfx' && type === 'from') {
    balanceTitle = (
      <>
        <Tooltip title={t(translations.swap.availableBalanceTip)}>
          <span className="icon-container">
            <img src={imgInfo} alt="?" className="icon-info" />
          </span>
        </Tooltip>
        <span className="text">{t(translations.swap.availableBalance)}</span>
      </>
    );
  }

  const handleInputChange = e => {
    let value = e.target.value;
    if (value === '' || isSafeNumberOrNumericStringInput(value)) {
      const decimal = value.split('.')[1];

      if (decimal && decimal.length > MAX_DECIMALS) {
        return;
      } else {
        onInputChange(value);
      }
    }
  };

  const b = formatNumber(balance, {
    precision: MAX_FORMAT_DECIMALS,
  });

  const handleMax = () => {
    onInputChange(balance);
  };

  let max: React.ReactNode = (
    <span className="max" onClick={handleMax}>
      {t(translations.swap.max)}
    </span>
  );

  if (type === 'to') {
    title = t(translations.swap.to);
    max = null;
  }

  return (
    <StyledSwapItemWrapper>
      <div className="top">
        <span className="left">{title}</span>
        <span className="right">
          {balanceTitle}: {b}
        </span>
      </div>
      <div className="bottom">
        <span className="left">
          <Input
            placeholder="0.0"
            value={value}
            size="small"
            onChange={handleInputChange}
          ></Input>
        </span>
        <span className="right">
          {max}
          <span className="select">
            <Select value={selected} size="small" onChange={onSelectChange}>
              <Select.Option value="cfx">cfx</Select.Option>
              <Select.Option value="wcfx">wcfx</Select.Option>
            </Select>
          </span>
        </span>
      </div>
    </StyledSwapItemWrapper>
  );
};

const StyledSwapItemWrapper = styled.div`
  width: 27.4286rem;
  border-radius: 0.2857rem;
  border: 1px solid #cccccc;
  padding: 1.1429rem;

  .top {
    display: flex;
    justify-content: space-between;
    color: #7e8598;
    line-height: 1.2857rem;

    .icon-container {
      cursor: pointer;

      .icon-info {
        margin-top: -0.2857rem;
      }
    }

    .text {
      margin-left: 0.3571rem;
    }

    .right {
      display: inline-flex;
      align-items: center;
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.1429rem;

    .right {
      display: flex;
      align-items: center;

      .max {
        width: 3.6429rem;
        height: 1.4286rem;
        background: #fede1b;
        border-radius: 0.1429rem;
        display: inline-flex;
        justify-content: center;
        color: #65709a;
        cursor: pointer;
        font-size: 1rem;
        margin-right: 1.1429rem;
      }
    }
  }
`;

export function Swap() {
  const { t } = useTranslation();
  const { accounts, authConnectStatus, provider, useBalance } = usePortal();
  const cfx = useBalance();
  const { addRecord } = useTxnHistory();

  const CFX = new SDK.Conflux({
    url: ENV_CONFIG.ENV_RPC_SERVER,
    networkId: NETWORK_ID,
  });

  CFX.provider = provider;

  const contract = CFX.Contract({
    address: CONTRACTS.wcfx,
    abi,
  });

  const [wcfx, setWcfx] = useState('0');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showModal, setShowModal] = useState({
    show: false,
    hash: '',
    status: '',
    errorMessage: '',
  });

  const [fromToken, setFromToken] = useState({
    type: 'wcfx',
    value: '',
  });
  const [toToken, setToToken] = useState({
    type: 'cfx',
    value: '',
  });
  const balances = {
    cfx: cfx?.toDecimalMinUnit() ?? '0',
    wcfx,
  };

  useEffect(() => {
    if (accounts.length) {
      // @todo, the interval maybe not good, need to change
      const interval = setInterval(() => {
        contract.balanceOf(accounts[0]).then(data => {
          setWcfx(data.toString());
        });
      }, 2000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [accounts, authConnectStatus, contract, CFX]);

  const handleInputChange = value => {
    setFromToken({
      ...fromToken,
      value,
    });
    setToToken({
      ...toToken,
      value,
    });
  };

  const handleFromSelectChange = () => {
    handleSwitch();
  };

  const handleToSelectChange = () => {
    handleSwitch();
  };

  const handleSwitch = () => {
    const toTokenCopy = {
      ...toToken,
    };
    setToToken(fromToken);
    setFromToken(toTokenCopy);
  };

  const handleSwap = () => {
    const value = new BigNumber(fromToken.value).multipliedBy(1e18).toString();
    const recordFromValue = formatNumber(fromToken.value, {
      precision: MAX_FORMAT_DECIMALS,
    });
    const recordToValue = formatNumber(toToken.value, {
      precision: MAX_FORMAT_DECIMALS,
    });
    setSubmitLoading(true);
    setShowModal({
      ...showModal,
      show: true,
    });
    if (fromToken.type === 'cfx') {
      const code = TXN_ACTION.swapCFXToWCFX;
      // deposit
      contract
        .deposit()
        .sendTransaction({
          from: accounts[0],
          value,
        })
        .then(hash => {
          setShowModal({
            ...showModal,
            show: true,
            hash,
          });
          addRecord({
            hash,
            info: JSON.stringify({
              code: code,
              description: '',
              hash,
              cfxValue: recordFromValue,
              wcfxValue: recordToValue,
            }),
          });
        })
        .catch(e => {
          setShowModal({
            ...showModal,
            show: true,
            status: 'error',
            errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
          });
        })
        .finally(() => {
          setSubmitLoading(false);
          setFromToken({
            ...fromToken,
            value: '',
          });
          setToToken({
            ...toToken,
            value: '',
          });

          trackEvent({
            category: ScanEvent.wallet.category,
            action:
              ScanEvent.wallet.action.txnAction[code] ||
              ScanEvent.wallet.action.txnActionUnknown,
          });
        });
    } else if (fromToken.type === 'wcfx') {
      const code = TXN_ACTION.swapWCFXToCFX;
      // withdraw
      contract
        .withdraw(value)
        .sendTransaction({
          from: accounts[0],
        })
        .then(hash => {
          setShowModal({
            ...showModal,
            show: true,
            hash,
          });
          addRecord({
            hash: hash,
            info: JSON.stringify({
              code: code,
              description: '',
              hash: hash,
              cfxValue: recordFromValue,
              wcfxValue: recordToValue,
            }),
          });
        })
        .catch(e => {
          setShowModal({
            ...showModal,
            show: true,
            status: 'error',
            errorMessage: e.code ? `${e.code} - ${e.message}` : e.message,
          });
        })
        .finally(() => {
          setSubmitLoading(false);
          setFromToken({
            ...fromToken,
            value: '',
          });
          setToToken({
            ...toToken,
            value: '',
          });

          trackEvent({
            category: ScanEvent.wallet.category,
            action:
              ScanEvent.wallet.action.txnAction[code] ||
              ScanEvent.wallet.action.txnActionUnknown,
          });
        });
    }
  };

  const toBalance = new BigNumber(balances[toToken.type]).div(1e18).toString();
  const fromBalanceBN = new BigNumber(balances[fromToken.type]).div(1e18);
  let fromBalance = '';

  if (fromToken.type === 'cfx') {
    fromBalance = fromBalanceBN.gte(0.1)
      ? fromBalanceBN.minus(0.1).toString()
      : fromBalanceBN.toString();
  } else {
    fromBalance = fromBalanceBN.toString();
  }

  const getButton = () => {
    const fromValueBN = new BigNumber(fromToken.value);

    let buttonText = t(translations.swap.swap);
    let disabled = false;

    if (!accounts.length) {
      buttonText = t(translations.swap.connectWallet);
    } else if (fromValueBN.isNaN() || fromValueBN.eq(0)) {
      buttonText = t(translations.swap.enterAmount);
      disabled = true;
    } else if (fromValueBN.gt(fromBalance)) {
      buttonText = t(translations.swap.insufficientBalance, {
        type: fromToken.type.toUpperCase(),
      });
      disabled = true;
    }

    return (
      <Button
        type="action"
        color="primary"
        size="small"
        disabled={disabled || submitLoading}
        onClick={handleSwap}
        loading={submitLoading}
        style={{
          textTransform: 'none',
        }}
      >
        {buttonText}
      </Button>
    );
  };

  const handleClose = () => {
    // reset modal status
    setShowModal({
      show: false,
      hash: '',
      status: '',
      errorMessage: '',
    });
  };

  return (
    <StyledSwapWrapper>
      <Card className="card">
        <div className="body">
          <div className="title">{t(translations.swap.swap)}</div>
          <div className="content">
            <SwapItem
              balance={fromBalance}
              value={fromToken.value}
              type="from"
              selected={fromToken.type}
              onInputChange={handleInputChange}
              onSelectChange={handleFromSelectChange}
            ></SwapItem>
            <div className="switch">
              <img
                alt="switch-icon"
                src={imgSwapArrowDown}
                onClick={handleSwitch}
              ></img>
            </div>
            <SwapItem
              balance={toBalance}
              value={toToken.value}
              type="to"
              selected={toToken.type}
              onInputChange={handleInputChange}
              onSelectChange={handleToSelectChange}
            ></SwapItem>
          </div>
        </div>
      </Card>
      <div className="button-container">
        <ConnectButton>{getButton()}</ConnectButton>
      </div>
      <TxnStatusModal
        show={showModal.show}
        status={showModal.status}
        onClose={handleClose}
        hash={showModal.hash}
        errorMessage={showModal.errorMessage}
      />
    </StyledSwapWrapper>
  );
}

const StyledSwapWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 32rem;
  margin: auto;

  ${media.m} {
    width: inherit;
  }

  .card.card {
    width: 32rem;
    margin-top: 7.1429rem;

    ${media.m} {
      width: inherit;
    }
  }

  .body {
    padding: 1.4286rem 0 2.8571rem;

    .title {
      font-size: 1.2857rem;
      font-weight: 500;
      color: #3a3a3a;
      line-height: 1.8571rem;
    }
  }

  .content {
    margin-top: 1.1429rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .switch {
      width: 1.7143rem;
      height: 1.7143rem;
      cursor: pointer;
      margin: 0.5714rem;
    }
  }

  .button-container {
    height: 5.7143rem;
    background: #f1f3f6;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
