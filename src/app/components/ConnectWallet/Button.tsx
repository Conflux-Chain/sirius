/**
 *
 * Button
 *
 */
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { usePortal } from 'utils/hooks/usePortal';
import { TxnHistoryContext } from 'utils/hooks/useTxnHistory';
import { formatNumber } from 'utils';
import { RotateImg } from './RotateImg';
import { useCheckHook } from './useCheckHook';
import BigNumber from 'bignumber.js';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';

import iconLoadingWhite from './assets/loading-white.svg';

interface Button {
  className?: string;
  onClick?: () => void;
  showBalance?: boolean;
}

export const Button = ({ className, onClick, showBalance }: Button) => {
  const { t } = useTranslation();
  const {
    installed,
    connected,
    accounts,
    balances: { cfx },
  } = usePortal();
  const { pendingRecords } = useContext(TxnHistoryContext);
  const { isValid } = useCheckHook(true);
  let cfxBalance = cfx
    ? formatNumber(new BigNumber(cfx).div(1e18).toString(), {
        precision: 6,
      })
    : '0';

  let buttonText = t(translations.connectWallet.button.text);
  let buttonStatus: React.ReactNode = '';
  let hasPendingRecords = connected === 1 && !!pendingRecords.length;

  if (installed) {
    if (accounts.length && isValid) {
      if (hasPendingRecords) {
        buttonStatus = (
          <RotateImg
            className="button-status-pending"
            src={iconLoadingWhite}
            alt="icon-pending"
          ></RotateImg>
        );
        buttonText = t(translations.connectWallet.button.nPending, {
          count: pendingRecords.length,
        });
      } else {
        buttonText = accounts[0].replace(/(.*:.{6}).*(.{8})/, '$1...$2');
        buttonStatus = <span className="button-status-online"></span>;
      }
    }
  }

  useEffect(() => {
    if (connected === 0) {
      trackEvent({
        category: ScanEvent.wallet.category,
        action: ScanEvent.wallet.action.disconnect,
      });
    } else if (connected === 1) {
      trackEvent({
        category: ScanEvent.wallet.category,
        action: ScanEvent.wallet.action.connect,
      });
    }
  }, [connected]);

  return (
    <ButtonWrapper
      className={clsx('connect-wallet-button', className, {
        pending: hasPendingRecords,
        connected: accounts.length && isValid,
        notConnected: !(accounts.length && isValid),
      })}
      onClick={onClick}
    >
      <span className="connect-wallet-button-left">
        {buttonStatus}
        <span className="text">{buttonText}</span>
      </span>
      {accounts.length && showBalance && !hasPendingRecords ? (
        <span className="balance">{cfxBalance} CFX</span>
      ) : null}
    </ButtonWrapper>
  );
};

Button.defaultProps = {
  showBalance: true,
};

const ButtonWrapper = styled.div`
  height: 2.2857rem;
  background: #c9d5f1;
  border-radius: 1.1429rem;
  margin-right: 1.1429rem;
  display: flex;
  align-items: center;
  justify-items: center;
  font-size: 1rem;
  font-weight: 500;
  color: #65709a;
  cursor: pointer;

  &.pending {
    background: #fede1b;
    color: #ffffff;

    .connect-wallet-button-left {
      background: #fede1b;
      color: #ffffff;
    }
  }

  &:not(.pending):hover {
    background: #ffe872;

    .connect-wallet-button-left {
      background: #ffe872;
    }
  }

  .button-status-online {
    width: 0.5714rem;
    height: 0.5714rem;
    background: #7cd77b;
    border-radius: 0.2857rem;
    margin-right: 0.5714rem;
  }

  .button-status-pending {
    width: 0.8571rem;
    height: 0.8571rem;
    margin-right: 0.4286rem;
  }

  .balance {
    padding: 0 0.8571rem 0 0.5714rem;
  }

  .connect-wallet-button-left {
    display: inline-flex;
    align-items: center;
    height: 2.2857rem;
    padding: 0 0.8571rem;
    background: #f5f6fa;
    border-radius: 3.5714rem;
    cursor: pointer;
  }
`;
