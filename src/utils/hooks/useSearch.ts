import { useHistory } from 'react-router';
import {
  isAccountAddress,
  isContractAddress,
  isBlockHash,
  isHash,
  isEpochNumber,
  formatAddress,
  getAddressInfo,
  isAddress,
  isCurrentNetworkAddress,
} from 'utils';
import { tranferToLowerCase } from 'sirius-next/packages/common/dist/utils';
import { CONTRACTS, DEFAULT_NETWORK_IDS } from '../constants';
import { NETWORK_TYPE, NETWORK_TYPES } from 'utils/constants';
import { trackEvent } from '../ga';
import { ScanEvent } from '../gaConstants';

// Search bar hook
export const useSearch = (value?: string) => {
  const history = useHistory();
  let innerValue = value;

  const setSearch = async (
    searchValue?: string,
    setValue?: (value: string | undefined) => void,
  ) => {
    innerValue = searchValue || value;

    if (typeof innerValue !== 'string' || innerValue.trim() === '') return;

    // cip-37
    innerValue = tranferToLowerCase(innerValue.trim());

    // zero address support
    if (innerValue === '0x0') {
      history.push(`/address/${CONTRACTS.zero}`);
      // update searchbar value from 0x0 to zeroAddress
      setValue && setValue(CONTRACTS.zero);
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.zeroAddress,
        label: innerValue,
      });
      return;
    }

    if (isAddress(innerValue)) {
      if (!isCurrentNetworkAddress(innerValue)) {
        if (
          // only search network = 1/1029 in mainnet or testnet environment will go to networkERROR page, others will go to 404
          [NETWORK_TYPES.mainnet, NETWORK_TYPES.testnet].includes(
            NETWORK_TYPE,
          ) &&
          [DEFAULT_NETWORK_IDS.mainnet, DEFAULT_NETWORK_IDS.testnet].includes(
            getAddressInfo(innerValue)?.netId as number,
          )
        ) {
          history.push('/networkError');

          return;
        } else {
          history.push('/404');

          return;
        }
      }

      history.push(`/address/${formatAddress(innerValue)}`);

      trackEvent({
        category: ScanEvent.search.category,
        action: isAccountAddress(innerValue)
          ? ScanEvent.search.action.account
          : isContractAddress(innerValue)
          ? ScanEvent.search.action.contract
          : ScanEvent.search.action.innerContract,
        label: innerValue,
      });

      return;
    }

    if (isEpochNumber(innerValue)) {
      history.push(`/epoch/${innerValue}`);
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.epoch,
        label: innerValue,
      });
      return;
    }

    try {
      const isBlock = await isBlockHash(innerValue);
      if (isBlock) {
        history.push(`/block/${innerValue}`);
        trackEvent({
          category: ScanEvent.search.category,
          action: ScanEvent.search.action.block,
          label: innerValue,
        });
        return;
      }

      if (isHash(innerValue as string)) {
        history.push(`/transaction/${innerValue}`);
        trackEvent({
          category: ScanEvent.search.category,
          action: ScanEvent.search.action.transaction,
          label: innerValue,
        });
        return;
      }

      history.push('/404');
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.invalid,
        label: innerValue,
      });
    } catch (e) {}
  };

  return [innerValue, setSearch] as const;
};
