import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useTestnet } from 'utils/hooks/useTestnet';
import { useNotifications } from '@cfxjs/react-ui';
import { address as utilAddress } from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { usePortal } from 'utils/hooks/usePortal';
import XCircleFill from '@zeit-ui/react-icons/xCircleFill';

interface Props {
  showNotification?: boolean;
}

export const useCheckHook = function <Props>(showNotification = false) {
  const { t } = useTranslation();
  const isTestnet = useTestnet();
  const { installed, connected, accounts, chainId } = usePortal();
  const [, setNotifications] = useNotifications();

  const checkNetworkValid = () => {
    if (installed && chainId !== '0xNaN') {
      if (
        (chainId === '0x405' && !isTestnet) ||
        (chainId !== '0x405' && isTestnet)
      ) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  };

  const checkVersionValid = () => {
    if (installed && connected === 1) {
      return utilAddress.isValidCfxAddress(accounts[0]);
    }
    return true;
  };

  const notifyNetworkError = () => {
    let content = t(translations.connectWallet.modal.switchToMainnet);

    if (isTestnet) {
      content = t(translations.connectWallet.modal.switchToTestnet);
    }

    setNotifications({
      icon: <XCircleFill color="#e15c56" />,
      title: t(translations.connectWallet.modal.networkNotice),
      content,
      delay: 5000,
    });
  };

  const notifyVersionError = () => {
    setNotifications({
      icon: <XCircleFill color="#e15c56" />,
      title: t(translations.connectWallet.modal.versionNotice),
      content: t(translations.connectWallet.modal.upgradeTipVersion),
      delay: 5000,
    });
  };

  const [isNetworkValid, setIsNetworkValid] = useState(checkNetworkValid);
  const [isVersionValid, setIsVersionValid] = useState(checkVersionValid);

  useEffect(() => {
    const isNetworkValid = checkNetworkValid();
    const isVersionValid = checkVersionValid();

    if (showNotification) {
      if (installed && connected === 1 && !isVersionValid) {
        notifyVersionError();
      }

      if (installed && connected === 1 && !isNetworkValid) {
        notifyNetworkError();
      }
    }

    // prevent unknonw status update
    if (chainId !== '0xNaN') {
      setIsVersionValid(isVersionValid);
      setIsNetworkValid(isNetworkValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [installed, connected, chainId, isTestnet]);

  return {
    isNetworkValid,
    isVersionValid,
    isValid: isNetworkValid && isVersionValid,
    notifyVersionError,
    notifyNetworkError,
  };
};
