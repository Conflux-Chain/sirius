import { useRef } from 'react';
import useSWR, { responseInterface } from 'swr';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { formatBalance } from './index';
import fetch from './request';
import { CURRENCY } from 'utils/constants';

export const appendApiPrefix = (url: string) => {
  // for cfx top N
  if (url.startsWith('/stat/')) {
    return url;
  }
  return `/v1${url}`;
};

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
  return await fetch(appendApiPrefix(url), {
    method: 'get',
  });
};

const simplePostFetcher = async (...args: any[]) => {
  let [url, params, shouldAppendPrefix] = args;
  shouldAppendPrefix =
    shouldAppendPrefix === undefined ? true : shouldAppendPrefix;

  return await fetch(shouldAppendPrefix ? appendApiPrefix(url) : url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
};

export const useSWRWithGetFecher = (key, swrOpts = {}) => {
  const isTransferReq =
    (typeof key === 'string' && key.startsWith('/transfer')) ||
    (Array.isArray(key) &&
      typeof key[0] === 'string' &&
      key[0].startsWith('/transfer'));

  const { data, error, mutate } = useSWR(key, simpleGetFetcher, { ...swrOpts });

  let tokenAddress;

  // deal with token info
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
        const tokenInfo = tokenData.list.find(t => t.address === trans.address);
        if (tokenInfo) return { ...trans, token: { ...tokenInfo } };
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
      ? [`/stat/tokens/by-address?address=${params[0].address}:''`, ...params]
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
    shouldFetch ? [`/contract/${params[0].address}`, ...params] : null,
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
      ? qs.stringifyUrl({
          url: '/token',
          query: {
            accountAddress,
            fields,
            currency: CURRENCY,
          },
        })
      : null,
    url =>
      fetch(appendApiPrefix(url))
        .then(({ total, list }) => {
          return {
            loading: false,
            total,
            list,
          };
        })
        .catch(error => {
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
        .then(rst => {
          return {
            ...rst,
          };
        })
        .catch(error => {
          return {
            address: accountAddress,
            balance: notAvaiableText,
            stakingBalance: notAvaiableText,
            accumulatedInterestReturn: notAvaiableText,
            collateralForStorage: notAvaiableText,
            transactionCount: notAvaiableText,
          };
        }),
    {
      initialData: {
        address: accountAddress,
        balance: loadingText,
        stakingBalance: loadingText,
        accumulatedInterestReturn: loadingText,
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
        .then(rst => {
          return {
            name: null,
            website: null,
            admin: null,
            abi: null,
            sourceCode: null,
            ...rst,
            // sponsor: {
            //   sponsorForGas: null,
            //   sponsorForCollateral: null,
            //   sponsorBalanceForGas:
            //     sponsorInfo && sponsorInfo.sponsorBalanceForGas !== undefined
            //       ? formatBalance(sponsorInfo.sponsorBalanceForGas)
            //       : null,
            //   sponsorBalanceForCollateral:
            //     sponsorInfo &&
            //     sponsorInfo.sponsorBalanceForCollateral !== undefined
            //       ? formatBalance(sponsorInfo.sponsorBalanceForCollateral)
            //       : null,
            // },
          };
        })
        .catch(error => {
          return {
            epochNumber: 0,
            address: contractAddress,
            from: null,
            transactionHash: null,
            admin: null,
            collateralForStorage: '0',
            sponsor: {
              sponsorGasBound: '0',
              sponsorBalanceForGas: '0',
              sponsorBalanceForCollateral: '0',
              sponsorForGas: null,
              sponsorForCollateral: null,
            },
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
        sponsor: {
          sponsorGasBound: '0',
          sponsorBalanceForGas: '0',
          sponsorBalanceForCollateral: '0',
          sponsorForGas: loadingText,
          sponsorForCollateral: loadingText,
        },
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
export const useTransactions = (query: any = {}, opts = {}) => {
  return useSWR(
    qs.stringifyUrl({
      url: '/transaction',
      query,
    }),
    url =>
      fetch(url)
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
    data = await fetch(appendApiPrefix('/dag'));
  } catch (error) {
    data = { total: 0, list: [] };
  }

  return data;
};

const fetchClientVersion = async () => {
  const version = await simplePostFetcher(
    '/rpcv2', // cip-37
    {
      jsonrpc: '2.0',
      id: '0',
      method: 'cfx_clientVersion',
      params: [],
    },
    false,
  ).catch(() => {});
  return version;
};

export const useClientVersion = () => {
  const { data: version } = useSWR('client version', fetchClientVersion);
  return version?.result;
};
