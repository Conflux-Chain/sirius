import { useHistory } from 'react-router';
import {
  isAccountAddress,
  isContractAddress,
  isInnerContractAddress,
  isBlockHash,
  isHash,
  isEpochNumber,
  tranferToLowerCase,
} from 'utils';
import { zeroAddress } from '../constants';
import { formatAddress } from '../cfx';
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
      history.push(`/address/${zeroAddress}`);
      // update searchbar value from 0x0 to zeroAddress
      setValue && setValue(zeroAddress);
      trackEvent({
        category: ScanEvent.search.category,
        action: ScanEvent.search.action.zeroAddress,
        label: innerValue,
      });
      return;
    }

    if (
      isAccountAddress(innerValue) ||
      isContractAddress(innerValue) ||
      isInnerContractAddress(innerValue)
    ) {
      history.push(`/address/${formatAddress(innerValue)}`); // cip-37 convert to new format
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
