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

interface Props {
  children?: React.ReactChild;
  profile?: boolean;
}

export const ConnectButton = ({ children, profile = false }: Props) => {
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

  return (
    <>
      <span onClickCapture={handleClick}>{children}</span>
      <Modal show={showModal} onClose={handleClose}></Modal>
    </>
  );
};

export const ConnectWallet = () => {
  return (
    <ConnectButton profile={true}>
      <Button />
    </ConnectButton>
  );
};
