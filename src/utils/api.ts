import { useRef } from 'react';
import useSWR, { responseInterface } from 'swr';
import qs from 'query-string';
import { Big } from '@cfxjs/react-hooks';
import numeral from 'numeral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export const appendApiPrefix = (url: string) => `/api${url}`;

function formatBalance(balance, decimals = 18) {
  return numeral(Big(balance).div(Big(10).pow(decimals)).toString()).format(
    '0,0.[123456]',
  );
}

export interface Params {
  [name: string]: string | string[];
}

export type useApi = (
  params?: Params | any[],
  shouldFetch?: boolean,
  ...rest: any[]
) => responseInterface<any, any>;

export const simpleGetFetcher = async (...args: any[]) => {
  let [url, query] = args;
  if (query) {
    url = qs.stringifyUrl({ url, query });
  }

  const res = await fetch(appendApiPrefix(url), {
    method: 'get',
  });
  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error['info'] = await res.json();
    error['status'] = res.status;
    throw error;
  }
  return await res.json();
};

const simplePostFetcher = async (...args: any[]) => {
  let [url, params] = args;
  const res = await fetch(appendApiPrefix(url), {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error['info'] = await res.json();
    error['status'] = res.status;
    throw error;
  }
  return await res.json();
};

export const useDashboardDag: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/dashboard/dag', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardEpoch: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/dashboard/epoch', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardPlot: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/dashboard/plot', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardTrend: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/dashboard/trend', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useAddressQuery: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/address/query', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockList: useApi = (params, shouldFetch = true, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/block/list', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockQuery: useApi = (params, shouldFetch = true, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch
      ? [`/block/${params[0].hash}?${params[0].hash}:''`, ...params]
      : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransactionList: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/transaction/list', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransactionQuery = (
  params?: Params | any[],
  shouldFetch = true,
  ...rest: any[]
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch
      ? [`/transaction/${params[0].hash}?${params[0].hash}:''}`, ...params]
      : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransferList: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/transfer', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useContractList: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/contract/list', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenList: useApi = (params, shouldFetch = true, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/token', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenQuery: useApi = (params, shouldFetch = true, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch
      ? [`/token/${params[0].address}?${params[0].address}:''`, ...params]
      : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useUtilType: useApi = (params, shouldFetch = true, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/util/type', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};

export const useCMAccountTokenList: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/contract-manager/account/token/list', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractQuery: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch
      ? [`/contract/${params[0].address}?${params[0].address}:''`, ...params]
      : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractList: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/contract-manager/contract/list', ...params] : null,
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractCreate: useApi = (
  params,
  shouldFetch = true,
  ...rest
) => {
  if (!Array.isArray(params)) params = [params];
  // params = useRef(params).current;
  return useSWR(
    shouldFetch ? ['/contract', ...params] : null,
    rest[1] || simplePostFetcher,
    rest[0],
  );
};

export const useAccountTokenList = (
  accountAddress: string,
  fields: string[] = [],
  opts = {},
) => {
  return useSWR(
    accountAddress
      ? qs.stringifyUrl({ url: '/token', query: { accountAddress, fields } })
      : null,
    url =>
      fetch(appendApiPrefix(url))
        .then(res => res.json())
        .then(({ total, list }) => {
          return {
            total,
            list: list.map(t => {
              const { balance, decimals } = t;
              return {
                ...t,
                balance: formatBalance(balance, decimals),
              };
            }),
          };
        }),
    {
      initialData: {
        total: 0,
        list: [],
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

// this is the new api
export const useAccount = (
  accountAddress?: string,
  fields: string[] = [],
  opts = {},
) => {
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const notAvaiableText = t(translations.general.security.notAvailable);

  const url = qs.stringifyUrl({
    url: `/account/${accountAddress}`,
    query: { fields },
  });

  return useSWR(
    accountAddress ? url : null,
    url =>
      fetch(appendApiPrefix(url))
        .then(res => res.json())
        .then(rst => {
          return {
            ...rst,
            balance: rst.balance ? formatBalance(rst.balance) : notAvaiableText,
          };
        })
        .catch(() => ({
          address: accountAddress,
          balance: notAvaiableText,
          collateralForStorage: notAvaiableText,
          transactionCount: notAvaiableText,
        })),
    {
      initialData: {
        address: accountAddress,
        balance: loadingText,
        collateralForStorage: loadingText,
        transactionCount: loadingText,
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

// this is the new api
export const useContract = (
  contractAddress?: string,
  fields: string[] = [],
  opts = {},
) => {
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const notAvaiableText = t(translations.general.security.notAvailable);
  const url = qs.stringifyUrl({
    url: `/contract/${contractAddress}`,
    query: { fields },
  });

  return useSWR(
    contractAddress ? url : null,
    url =>
      fetch(appendApiPrefix(url))
        .then(res => res.json())
        .then(rst => {
          const { sponsorBalanceForGas, sponsorBalanceForCollateral } = rst;
          return {
            name: notAvaiableText,
            website: notAvaiableText,
            admin: notAvaiableText,
            abi: notAvaiableText,
            sourceCode: notAvaiableText,
            sponsorForGas: notAvaiableText,
            sponsorForCollateral: notAvaiableText,
            ...rst,
            sponsorBalanceForGas:
              sponsorBalanceForGas !== undefined
                ? formatBalance(sponsorBalanceForGas)
                : notAvaiableText,
            sponsorBalanceForCollateral:
              sponsorBalanceForCollateral !== undefined
                ? formatBalance(sponsorBalanceForCollateral)
                : notAvaiableText,
          };
        })
        .catch(() => ({
          epochNumber: 0,
          address: contractAddress,
          from: notAvaiableText,
          transactionHash: notAvaiableText,
          admin: notAvaiableText,
          collateralForStorage: '0',
          sponsorGasBound: '0',
          sponsorBalanceForGas: '0',
          sponsorBalanceForCollateral: '0',
          sponsorForGas: notAvaiableText,
          sponsorForCollateral: notAvaiableText,
          name: notAvaiableText,
          website: notAvaiableText,
          abi: notAvaiableText,
          sourceCode: notAvaiableText,
          icon: undefined,
        })),
    {
      initialData: {
        epochNumber: 0,
        address: contractAddress,
        from: loadingText,
        transactionHash: loadingText,
        admin: loadingText,
        collateralForStorage: '0',
        sponsorGasBound: '0',
        sponsorBalanceForGas: '0',
        sponsorBalanceForCollateral: '0',
        sponsorForGas: loadingText,
        sponsorForCollateral: loadingText,
        name: loadingText,
        website: loadingText,
        abi: loadingText,
        sourceCode: loadingText,
        icon: undefined,
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

// this is the new api
export const useToken = (
  contractAddress?: string,
  fields: string[] = [],
  opts = {},
) => {
  const { t } = useTranslation();
  const loadingText = t(translations.general.loading);
  const notAvaiableText = t(translations.general.security.notAvailable);
  const url = qs.stringifyUrl({
    url: `/token/${contractAddress}`,
    query: { fields },
  });

  return useSWR(
    contractAddress ? url : null,
    url =>
      fetch(appendApiPrefix(url))
        .then(res => res.json())
        .then(rst => {
          const { totalSupply, decimals } = rst;
          return {
            ...rst,
            totalSupply:
              totalSupply !== undefined
                ? formatBalance(totalSupply, decimals)
                : notAvaiableText,
          };
        })
        .catch(() => ({
          address: contractAddress,
          name: notAvaiableText,
          symbol: notAvaiableText,
          decimals: 18,
          isERC721: false,
          totalSupply: '0',
          accountTotal: '0',
          transferCount: 0,
          isCustodianToken: false,
          icon: undefined,
        })),
    {
      initialData: {
        address: contractAddress,
        name: loadingText,
        symbol: loadingText,
        decimals: 18,
        isERC721: false,
        totalSupply: '0',
        accountTotal: '0',
        transferCount: 0,
        isCustodianToken: false,
        icon: undefined,
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

// this is the new api
export const useTransactions = (query = {}, opts = {}) => {
  return useSWR(
    qs.stringifyUrl({
      url: '/transaction',
      query,
    }),
    url =>
      fetch(url)
        .then(res => res.json())
        .then(rst => {
          const { list } = rst;
          return {
            ...rst,
            list: list.map(i => {
              const { value, gasPrice } = i;
              return {
                ...i,
                value: value !== undefined ? formatBalance(value) : 0,
                gasPrice:
                  gasPrice !== undefined ? formatBalance(gasPrice, 10) : 0,
              };
            }),
          };
        })
        .catch(() => ({
          total: 0,
          listLimit: 0,
          list: [],
        })),
    {
      initialData: {
        total: 0,
        listLimit: 0,
        list: [],
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

// this is the new api
export const useTransfers = (query = {}, opts = {}) => {
  return useSWR(
    qs.stringifyUrl({
      url: '/transfer',
      query,
    }),
    url =>
      fetch(url)
        .then(res => res.json())
        .then(rst => {
          const { list } = rst;
          return {
            ...rst,
            list: list.map(i => {
              const { value } = i;
              return {
                ...i,
                value: formatBalance(value),
              };
            }),
          };
        })
        .catch(() => ({
          total: 0,
          listLimit: 0,
          list: [],
        })),
    {
      initialData: {
        total: 0,
        listLimit: 0,
        list: [],
      },
      ...opts,
      revalidateOnMount: true,
    },
  );
};

export const fetchRecentDagBlock = async (opts = {}) => {
  let data;
  try {
    data = await fetch(appendApiPrefix('/dag')).then(res => res.json());
  } catch (err) {
    data = { total: 0, list: [] };
  }

  return data;
};
