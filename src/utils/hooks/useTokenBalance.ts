import { CFX } from 'utils/constants';
import ERC20ABI from '../contract/ERC20.json';
import useSWR from 'swr';

// get crc20/crc721 token balance
export const useTokenBalance = ({
  address,
  account,
  enabled = true,
}: {
  address: string;
  account: string;
  enabled?: boolean;
}) => {
  return useSWR<string>(
    enabled ? ['token balance', address, account] : null,
    async () => {
      try {
        const contract = CFX.Contract({
          abi: ERC20ABI.abi,
          address,
        });
        const res = await contract.balanceOf(account);
        return res.toString();
      } catch (error) {
        console.log('use token balance error', error);
        return '0';
      }
    },
  );
};
