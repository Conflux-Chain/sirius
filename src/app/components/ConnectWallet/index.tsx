/**
 *
 * ConnectWallet
 *
 */
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AuthConnectStatus, usePortal } from 'utils/hooks/usePortal';
import { useCheckHook } from './useCheckHook';
import { Text } from '@cfxjs/sirius-next-common/dist/components/Text';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';
import { switchChain } from '@cfxjs/use-wallet-react/conflux/Fluent';
import { NETWORK_ID } from 'utils/constants';

interface Props {
  children?: React.ReactChild;
  profile?: boolean;
}

export const ConnectButton = ({ children, profile = false }: Props) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { authConnectStatus } = usePortal();
  const { isValid } = useCheckHook();

  const handleClick = e => {
    if (!isValid) {
      e.stopPropagation();
      e.preventDefault();
      switchChain('0x' + NETWORK_ID.toString(16));
    } else if (
      profile ||
      authConnectStatus === AuthConnectStatus.NotConnected
    ) {
      e.stopPropagation();
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  let child = <span onClickCapture={handleClick}>{children}</span>;

  // wrap button which must connect portal
  if (
    !profile &&
    (authConnectStatus === AuthConnectStatus.NotConnected || !isValid)
  ) {
    child = (
      <Text
        onClickCapture={handleClick}
        hoverValue={t(translations.connectWallet.tip)}
      >
        {children}
      </Text>
    );
  }

  return (
    <>
      {child}
      <Modal show={showModal} onClose={handleClose}></Modal>
    </>
  );
};

export const ConnectWallet = () => {
  const location = useLocation();
  const showBalance = location.pathname.startsWith('/swap');

  return (
    <ConnectButton profile={true}>
      <Button showBalance={showBalance} />
    </ConnectButton>
  );
};

export { useCheckHook };
