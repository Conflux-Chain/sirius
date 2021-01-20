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

    // TODO checksum
    innerValue = tranferToLowerCase(innerValue.trim());

    // zero address support
    if (innerValue === '0x0') {
      history.push(`/address/${zeroAddress}`);
      // update searchbar value from 0x0 to zeroAddress
      setValue && setValue(zeroAddress);
      return;
    }

    if (
      isContractAddress(innerValue) ||
      isAccountAddress(innerValue) ||
      isInnerContractAddress(innerValue)
    ) {
      history.push(`/address/${innerValue}`);
      return;
    }

    if (isEpochNumber(innerValue)) {
      history.push(`/epoch/${innerValue}`);
      return;
    }

    try {
      const isBlock = await isBlockHash(innerValue);
      if (isBlock) {
        history.push(`/block/${innerValue}`);
        return;
      }

      if (isHash(innerValue as string)) {
        history.push(`/transaction/${innerValue}`);
        return;
      }

      history.push('/404');
    } catch (e) {}
  };

  return [innerValue, setSearch] as const;
};
