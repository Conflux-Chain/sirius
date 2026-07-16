import { useEffect, useState } from 'react';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { AuthConnectStatus, usePortal } from 'utils/hooks/usePortal';

export const useCheckHook = function () {
  const { authConnectStatus, account, chainId } = usePortal();

  const isNetworkValid = authConnectStatus !== AuthConnectStatus.NotChainMatch;

  const checkAddressValid = () => {
    if (!isNetworkValid) {
      return false;
    }
    if (account) {
      return SDK.address.isValidCfxAddress(account);
    }
    return true;
  };

  const [isAddressValid, setIsAddressValid] = useState(checkAddressValid);

  useEffect(() => {
    const isAddressValid = checkAddressValid();

    // prevent unknonw status update
    if (chainId !== '0xNaN') {
      setIsAddressValid(isAddressValid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authConnectStatus, chainId]);

  return {
    isNetworkValid,
    isAddressValid,
    isValid: isNetworkValid && isAddressValid,
  };
};
