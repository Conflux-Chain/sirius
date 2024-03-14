import React, { useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import styled from 'styled-components';
import clsx from 'clsx';
import { AuthConnectStatus, usePortal } from 'utils/hooks/usePortal';
import { TxnHistoryContext } from 'utils/hooks/useTxnHistory';
import { RotateImg } from './RotateImg';
import { useCheckHook } from './useCheckHook';
import { trackEvent } from 'utils/ga';
import { ScanEvent } from 'utils/gaConstants';
import { useGlobalData } from 'utils/hooks/useGlobal';
import { Bookmark } from '@zeit-ui/react-icons';
import { Text } from '../Text/Loadable';
import { getLabelInfo } from '../AddressContainer';
import { useENS } from 'utils/hooks/useENS';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

import iconLoadingWhite from './assets/loading-white.svg';
import { Balance } from './Balance';
import ENV_CONFIG, { NETWORK_TYPES } from 'env';

interface Button {
  className?: string;
  onClick?: () => void;
  showBalance?: boolean;
}

export const Button = ({ className, onClick, showBalance }: Button) => {
  const [globalData = {}] = useGlobalData();
  const { t } = useTranslation();
  const { authConnectStatus, accounts } = usePortal();
  const account = accounts[0];
  const { pendingRecords } = useContext(TxnHistoryContext);
  const { isValid } = useCheckHook();
  const [ensMap] = useENS({
    address: [account],
  });
  const { label, icon } = useMemo(
    () => getLabelInfo(ensMap[account]?.name, 'ens'),
    [account, ensMap],
  );

  let buttonText: React.ReactNode = t(
    translations.connectWallet.button.connectWallet,
  );
  let buttonStatus: React.ReactNode = '';
  let hasPendingRecords =
    authConnectStatus === AuthConnectStatus.Connected &&
    !!pendingRecords.length;

  if (authConnectStatus !== AuthConnectStatus.NotConnected) {
    if (isValid) {
      if (accounts.length) {
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
          const addressLabel =
            globalData[LOCALSTORAGE_KEYS_MAP.addressLabel]?.[account];

          if (label) {
            buttonText = (
              <StyledAddressLabelWrapper>
                {icon}
                {label}
              </StyledAddressLabelWrapper>
            );
          } else if (addressLabel) {
            buttonText = (
              <StyledAddressLabelWrapper>
                <Text span hoverValue={t(translations.profile.tip.label)}>
                  <Bookmark color="var(--theme-color-gray2)" size={16} />
                </Text>
                {addressLabel}
              </StyledAddressLabelWrapper>
            );
          } else if (
            ENV_CONFIG.ENV_NETWORK_TYPE === NETWORK_TYPES.CORE_MAINNET
          ) {
            buttonText = account.replace(/(.*:.{3}).*(.{8})/, '$1...$2');
          } else {
            buttonText = account.replace(/(.*:.{3}).*(.{4})/, '$1...$2');
          }

          buttonStatus = <span className="button-status-online"></span>;
        }
      }
    } else {
      buttonText = t(translations.connectWallet.button.switchNetwork);
    }
  }

  useEffect(() => {
    if (authConnectStatus === AuthConnectStatus.NotConnected) {
      trackEvent({
        category: ScanEvent.wallet.category,
        action: ScanEvent.wallet.action.disconnect,
      });
    } else if (authConnectStatus === AuthConnectStatus.Connected) {
      trackEvent({
        category: ScanEvent.wallet.category,
        action: ScanEvent.wallet.action.connect,
      });
    }
  }, [authConnectStatus]);

  return (
    <ButtonWrapper
      className={clsx('connect-wallet-button', className, {
        pending: hasPendingRecords,
        connected: accounts.length && isValid,
        notConnected: !(accounts.length && isValid),
        switchNetowrk:
          authConnectStatus !== AuthConnectStatus.NotConnected && !isValid,
      })}
      onClick={onClick}
    >
      <span className="connect-wallet-button-left">
        {buttonStatus}
        <span className="text">{buttonText}</span>
      </span>
      {isValid && accounts.length && showBalance && !hasPendingRecords ? (
        <Balance />
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

  &.switchNetowrk {
    .connect-wallet-button-left {
      background: #fbebeb;
      color: #e15c56;
    }
  }

  &.pending {
    background: #fede1b;
    color: #ffffff;

    .connect-wallet-button-left {
      background: #fede1b;
      color: #ffffff;
    }
  }

  &:not(.pending, .switchNetowrk):hover {
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
    flex-grow: 1;
  }
`;

const StyledAddressLabelWrapper = styled.span`
  /* display: inline-flex;
  vertical-align: middle;
  line-height: 2; */
`;
