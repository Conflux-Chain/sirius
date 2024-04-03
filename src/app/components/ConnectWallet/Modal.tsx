/**
 *
 * Modal
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import styled, { keyframes } from 'styled-components';
import clsx from 'clsx';
import { AuthConnectStatus, usePortal } from 'utils/hooks/usePortal';
import { Link as ScanLink } from './Link';
import { RotateImg } from './RotateImg';
import { History } from './History';
// @todo extract an independent component, do not use outside one
import { CopyButton } from './../CopyButton';
// import { AddressContainer } from './../../components/AddressContainer';
import { useCheckHook } from './useCheckHook';

import iconFluent from './assets/fluent.svg';
import iconClose from './assets/close.svg';
import iconLoading from './assets/loading.svg';

interface Modal {
  className?: string;
  show: boolean;
  onClose?: () => void;
}

export const Modal = ({
  className,
  show = false,
  onClose = () => {},
}: Modal) => {
  const { t } = useTranslation();
  const { login, authConnectStatus, accounts, installed } = usePortal();
  const { isValid } = useCheckHook();
  let inValidModalTip = t(translations.connectWallet.modal.upgradeTipAddress);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'inherit';
    }
    return () => {
      document.body.style.overflow = 'inherit';
    };
  }, [show]);

  useEffect(() => {
    if (!isValid) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid]);

  const handleClose = () => {
    onClose();
  };

  const handleLogin = () => {
    login()
      .then(() => onClose())
      .catch(e => console.log('connect wallet error: ', e));
  };

  let walletText = t(translations.connectWallet.modal.fluentWallet);
  let walletLogo = iconFluent;

  let title: string = t(translations.connectWallet.modal.title);
  let portal: React.ReactNode = walletText;
  let logo = (
    <img className="modal-portal-logo" src={walletLogo} alt="logo"></img>
  );
  let tip: React.ReactNode = (
    <div className="modal-tip">
      <span>{t(translations.connectWallet.modal.newToConflux)}</span>
      <a
        href="https://fluentwallet.com/"
        target="_blank"
        className="modal-tip-link"
        rel="noopener noreferrer"
      >
        {' '}
        {t(translations.connectWallet.modal.learnMore)}
      </a>
    </div>
  );
  let handleClick: VoidFunction | undefined = undefined;

  if (installed) {
    if (authConnectStatus === AuthConnectStatus.NotConnected) {
      portal = (
        <>
          <span className="modal-portal-name">{walletText}</span>
          {logo}
        </>
      );
      handleClick = handleLogin;
    } else if (authConnectStatus === AuthConnectStatus.Connected) {
      if (isValid) {
        title = t(translations.connectWallet.modal.account);
        portal = (
          <>
            <span className="modal-portal-connected-title">
              {t(translations.connectWallet.modal.connectedWithFluentWallet)}
            </span>
            <span className="modal-portal-name">{accounts[0]}</span>
            <span className="modal-portal-connected-tip">
              <span className="modal-portal-connected-copy">
                {t(translations.connectWallet.modal.copyAddress)}{' '}
                <CopyButton copyText={accounts[0]} size={10}></CopyButton>
              </span>
              <ScanLink href={`/address/${accounts[0]}`}>
                {t(translations.connectWallet.modal.viewOnConfluxScan)}
              </ScanLink>
            </span>
          </>
        );
        tip = null;
      } else {
        portal = (
          <>
            <span className="modal-portal-name">
              {t(translations.connectWallet.modal.cannotProcess)}
            </span>
            {logo}
          </>
        );
        tip = (
          <div className="modal-tip error">
            <span>{inValidModalTip}</span>
          </div>
        );
      }
    } else if (authConnectStatus === AuthConnectStatus.Connecting) {
      portal = (
        <>
          <span className="modal-portal-loading">
            <RotateImg
              src={iconLoading}
              alt="loading-icon"
              className="modal-portal-loading-icon"
            ></RotateImg>
            <span>{t(translations.connectWallet.modal.initializing)}</span>
          </span>
          {logo}
        </>
      );
    }
  } else {
    portal = (
      <a
        href="https://fluentwallet.com/"
        target="_blank"
        className="modal-portal-link"
        rel="noopener noreferrer"
      >
        {t(translations.connectWallet.modal.installFluentWallet)}
      </a>
    );
  }

  return (
    <ModalWrapper
      className={clsx('connect-wallet-modal', className, {
        show: show,
        connected: authConnectStatus === AuthConnectStatus.Connected && isValid,
        error: authConnectStatus === AuthConnectStatus.Connected && !isValid,
      })}
    >
      <div className="modal-and-history-container">
        <div className="modal-body">
          <div className="modal-title">{title}</div>
          <div className={clsx('modal-portal')} onClick={handleClick}>
            {portal}
          </div>
          {tip}
          <img
            className="modal-close"
            src={iconClose}
            alt="close-button"
            onClick={handleClose}
          ></img>
        </div>
        {isValid ? <History></History> : null}
      </div>
    </ModalWrapper>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const linkColor = '#0e47ef';
const redColor = '#e15c56';

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.25);
  display: none;
  z-index: 1000;

  &.show {
    display: flex;
  }

  &.connected {
    .modal-portal {
      flex-direction: column;
      align-items: flex-start;
      cursor: inherit;
    }
  }

  &.error {
    .modal-portal {
      border-color: ${redColor};
      cursor: default;

      .modal-portal-name {
        color: ${redColor};
      }
    }

    .modal-tip {
      color: ${redColor};
    }
  }

  .modal-and-history-container {
    box-sizing: border-box;
    border-radius: 0.5714rem;
    box-shadow: 0.5714rem 2.1429rem 5.7143rem 0rem rgba(112, 126, 158, 0.24);
    overflow: hidden;
  }

  .modal-body {
    position: relative;
    width: 39rem;
    background: #ffffff;
    padding: 1.7143rem 2.2857rem 2.2857rem;
    box-sizing: border-box;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 500;
    color: #333333;
  }

  .modal-portal {
    width: 34.5rem;
    border-radius: 0.2857rem;
    border: 1px solid #cccccc;
    margin-top: 1.1429rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.1429rem 1.1429rem;
    cursor: pointer;

    .modal-portal-connected-title,
    .modal-portal-connected-tip {
      font-size: 14px;
      color: #74798c;
    }

    .modal-portal-connected-copy {
      margin-right: 0.4286rem;
    }

    .modal-portal-loading {
      display: flex;

      .modal-portal-loading-icon {
        margin-right: 0.4286rem;
        animation: ${rotate} 1.5s ease-in-out infinite;
      }
    }

    .modal-portal-name {
      font-size: 16px;
      color: #3a3a3a;
      margin: 0.2857rem 0;
    }

    .modal-portal-logo {
      width: 1.8571rem;
      height: 1.8571rem;
    }

    .modal-portal-link {
      font-size: 18px;
      color: ${linkColor};
      text-decoration: underline;
    }
  }

  .modal-tip {
    margin-top: 1.7143rem;

    .modal-tip-link {
      color: ${linkColor};
    }
  }

  .modal-close {
    position: absolute;
    width: 1.7143rem;
    height: 1.7143rem;
    top: 0.8571rem;
    right: 0.8571rem;
    cursor: pointer;
    opacity: 0.75;

    &:hover {
      opacity: 1;
    }
  }
`;
