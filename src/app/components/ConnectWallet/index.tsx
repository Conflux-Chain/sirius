/**
 *
 * ConnectWallet
 *
 */
import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { usePortal } from 'utils/hooks/usePortal';
import { useCheckHook } from './useCheckHook';
import { Text } from '../Text';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useLocation } from 'react-router';

interface Props {
  children?: React.ReactChild;
  profile?: boolean;
}

export const ConnectButton = ({ children, profile = false }: Props) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const { installed, connected } = usePortal();
  const {
    isValid,
    notifyVersionError,
    notifyNetworkError,
    isNetworkValid,
    isVersionValid,
  } = useCheckHook();

  const handleClick = e => {
    if (!isValid) {
      e.stopPropagation();
      e.preventDefault();
      if (!isVersionValid) {
        notifyVersionError();
      }
      if (!isNetworkValid) {
        notifyNetworkError();
      }
    } else if (profile || !installed || connected === 0) {
      e.stopPropagation();
      e.preventDefault();
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  let child = <span onClickCapture={handleClick}>{children}</span>;

  if (!profile && (!installed || connected === 0 || !isValid)) {
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
