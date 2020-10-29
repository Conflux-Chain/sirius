import { useRef } from 'react';
import useSWR, { responseInterface } from 'swr';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { formatBalance } from './index';
import * as Sentry from '@sentry/browser';
export const appendApiPrefix = (url: string) => `/v1${url}`;

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
    Sentry.captureException(error);
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
    Sentry.captureException(error);
    throw error;
  }
  return await res.json();
};

export const useSWRWithGetFecher = (key, swrOpts = {}) => {
  const isTransferReq =
    (typeof key === 'string' && key.startsWith('/transfer')) ||
    (Array.isArray(key) &&
      typeof key[0] === 'string' &&
      key[0].startsWith('/transfer'));

  const { data, error, mutate } = useSWR(key, simpleGetFetcher, { ...swrOpts });

  let tokenAddress;

  if (isTransferReq && data && data.list) {
    tokenAddress = data.list.reduce((acc, trans) => {
      if (trans.address && !acc.includes(trans.address))
        acc.push(trans.address);
      return acc;
    }, []);
  }

  const { data: tokenData } = useSWR(
    tokenAddress
      ? qs.stringifyUrl({
          url: '/token',
          query: { addressArray: tokenAddress, fields: 'icon' },
        })
      : null,
    simpleGetFetcher,
  );

  if (tokenData && tokenData.list) {
    const newTransferList = data.list.map(trans => {
      if (tokenAddress.includes(trans.address)) {
        const tokenIdx = tokenAddress.indexOf(trans.address);
        if (tokenData.list[tokenIdx])
          return { ...trans, token: tokenData.list[tokenIdx] };
      }

      return trans;
    });

    return {
      data: {
        ...data,
        list: newTransferList,
      },
      error,
      mutate,
    };
  }

  return { data, error, mutate };
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
            loading: false,
            total,
            list: list.map(t => {
              const { balance, decimals } = t;
              return {
                ...t,
                balance: formatBalance(balance, decimals),
              };
            }),
          };
        })
        .catch(error => {
          Sentry.captureException(error);
          return {
            loading: false,
            total: 0,
            list: [],
          };
        }),
    {
      initialData: {
        loading: true,
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
          };
        })
        .catch(error => {
          Sentry.captureException(error);
          return {
            address: accountAddress,
            balance: notAvaiableText,
            collateralForStorage: notAvaiableText,
            transactionCount: notAvaiableText,
          };
        }),
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
            name: null,
            website: null,
            admin: null,
            abi: null,
            sourceCode: null,
            sponsorForGas: null,
            sponsorForCollateral: null,
            ...rst,
            sponsorBalanceForGas:
              sponsorBalanceForGas !== undefined
                ? formatBalance(sponsorBalanceForGas)
                : null,
            sponsorBalanceForCollateral:
              sponsorBalanceForCollateral !== undefined
                ? formatBalance(sponsorBalanceForCollateral)
                : null,
          };
        })
        .catch(error => {
          Sentry.captureException(error);
          return {
            epochNumber: 0,
            address: contractAddress,
            from: null,
            transactionHash: null,
            admin: null,
            collateralForStorage: '0',
            sponsorGasBound: '0',
            sponsorBalanceForGas: '0',
            sponsorBalanceForCollateral: '0',
            sponsorForGas: null,
            sponsorForCollateral: null,
            name: null,
            website: null,
            abi: null,
            sourceCode: null,
            icon: undefined,
          };
        }),
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
        .catch(error => {
          Sentry.captureException(error);
          return {
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
          };
        }),
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
        .catch(error => {
          Sentry.captureException(error);
          return {
            total: 0,
            listLimit: 0,
            list: [],
          };
        }),
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
        .catch(error => {
          Sentry.captureException(error);
          return {
            total: 0,
            listLimit: 0,
            list: [],
          };
        }),
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
  } catch (error) {
    Sentry.captureException(error);
    data = { total: 0, list: [] };
  }

  return data;
};
