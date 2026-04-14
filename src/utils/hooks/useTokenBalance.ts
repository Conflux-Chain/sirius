import { CFX } from 'utils/constants';
import ERC20ABI from '../contract/ERC20.json';
import useSWR from 'swr';
import qs from 'query-string';
import { fetchWithPrefix } from '@cfxjs/sirius-next-common/dist/utils/request';

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

// get crc1155 token balance
export const use1155TokenBalance = ({
  address,
  account,
  enabled = true,
}: {
  address: string;
  account: string;
  enabled?: boolean;
}) => {
  const url = qs.stringifyUrl({
    url: '/token',
    query: {
      accountAddress: account,
      addressArray: address,
    },
  });
  return useSWR<string>(
    enabled ? ['1155 token balance', url] : null,
    async () => {
      try {
        const res = await fetchWithPrefix<{
          total?: number;
          list: {
            address: string;
            transferType: string;
            balance: string;
            name: string;
            symbol: string;
            iconUrl: null;
            decimals: null;
            price: null;
          }[];
        }>(url);
        return res.list?.[0]?.balance || '0';
      } catch (error) {
        console.log('use 1155 token balance error', error);
        return '0';
      }
    },
  );
};
