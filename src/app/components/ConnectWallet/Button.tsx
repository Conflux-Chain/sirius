/**
 *
 * Button
 *
 */
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import styled from 'styled-components/macro';
import clsx from 'clsx';
import { usePortal } from 'utils/hooks/usePortal';
import { TxnHistoryContext } from 'utils/hooks/useTxnHistory';
import { RotateImg } from './RotateImg';
import { useCheckHook } from './useCheckHook';

import iconLoadingWhite from './assets/loading-white.svg';

interface Button {
  className?: string;
  onClick?: () => void;
}

export const Button = ({ className, onClick }: Button) => {
  const { t } = useTranslation();
  const { installed, connected, accounts } = usePortal();
  const { pendingRecords } = useContext(TxnHistoryContext);

  const { isValid } = useCheckHook(true);

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
        buttonText = accounts[0];
        buttonStatus = <span className="button-status-online"></span>;
      }
    }
  }

  return (
    <ButtonWrapper
      className={clsx('connect-wallet-button', className, {
        pending: hasPendingRecords,
      })}
      onClick={onClick}
    >
      {buttonStatus}
      <span className="text">{buttonText}</span>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div`
  height: 2.2857rem;
  background: #f5f6fa;
  border-radius: 1.1429rem;
  padding: 0 0.8571rem;
  margin-right: 1.1429rem;
  display: flex;
  align-items: center;
  justify-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #65709a;
  cursor: pointer;

  &.pending {
    background: #ffc438;
    color: #ffffff;
  }

  &:not(.pending):hover {
    background: rgba(100%, 87%, 11%, 70%);
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

  .text {
    max-width: 9.2857rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;
