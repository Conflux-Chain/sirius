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

export const useSearch = (value?: string) => {
  const history = useHistory();
  let innerValue = value;

  const setSearch = async (searchValue?: string) => {
    innerValue = searchValue || value;

    if (typeof innerValue !== 'string' || innerValue.trim() === '') return;

    innerValue = tranferToLowerCase(innerValue.trim());

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
