import { useEffect, useState } from 'react';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { AuthConnectStatus, usePortal } from 'utils/hooks/usePortal';

export const useCheckHook = function () {
  const { authConnectStatus, accounts, chainId } = usePortal();

  const isNetworkValid = authConnectStatus !== AuthConnectStatus.NotChainMatch;

  const checkAddressValid = () => {
    if (!isNetworkValid) {
      return false;
    }
    if (accounts[0]) {
      return SDK.address.isValidCfxAddress(accounts[0]);
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
