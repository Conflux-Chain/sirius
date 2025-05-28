import { useRef } from 'react';
import useSWR, { responseInterface } from 'swr';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { formatBalance } from './index';
import {
  fetchWithPrefix,
  simpleGetFetcher,
} from '@cfxjs/sirius-next-common/dist/utils/request';
import ENV_CONFIG, { IS_MAINNET, IS_CORESPACE } from 'env';
// import { getCurrency } from 'utils/constants';

interface Params {
  [name: string]: string | string[];
}

type useApi = (
  params?: Params | any[],
  shouldFetch?: boolean,
  ...rest: any[]
) => responseInterface<any, any>;

export const useSWRWithGetFecher = (key, swrOpts = {}) => {
  const isTransferReq =
    (typeof key === 'string' && key.startsWith('/transfer')) ||
    (Array.isArray(key) &&
      typeof key[0] === 'string' &&
      key[0].startsWith('/transfer'));

  const { data, error, mutate } = useSWR(key, simpleGetFetcher as any, {
    ...swrOpts,
  });

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
          query: { addressArray: tokenAddress, fields: 'iconUrl' },
        })
      : null,
    simpleGetFetcher as any,
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
            // currency: getCurrency(), // @todo wait for new api handler
          },
        })
      : null,
    url =>
      fetchWithPrefix(url)
        .then(({ total, list }: any) => {
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
      fetchWithPrefix(url)
        .then((rst: any) => {
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
            collateralForStorageInfo: {
              storageQuota: {
                storageCollateral: '0',
                storagePoint: '0',
              },
              storageUsed: {
                storageCollateral: '0',
                storagePoint: '0',
              },
            },
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
        collateralForStorageInfo: {
          storageQuota: {
            storageCollateral: '0',
            storagePoint: '0',
          },
          storageUsed: {
            storageCollateral: '0',
            storagePoint: '0',
          },
        },
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
      fetchWithPrefix(url)
        .then((rst: any) => {
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
            collateralForStorageInfo: {
              storageQuota: {
                storageCollateral: '0',
                storagePoint: '0',
              },
              storageUsed: {
                storageCollateral: '0',
                storagePoint: '0',
              },
            },
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
        collateralForStorageInfo: {
          storageQuota: {
            storageCollateral: '0',
            storagePoint: '0',
          },
          storageUsed: {
            storageCollateral: '0',
            storagePoint: '0',
          },
        },
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
      fetchWithPrefix(url)
        .then((rst: any) => {
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

export const fetchRecentDagBlock = async (opts = {}) => {
  let data;
  try {
    data = await fetchWithPrefix('/dag');
  } catch (error) {
    data = { total: 0, list: [] };
  }

  return data;
};

export const useCfxBalance: useApi = (params = {}) => {
  return useSWR(
    Object.keys(params).length ? ['/stat/get-cfx-balance-at', params] : null,
    simpleGetFetcher,
  );
};

export const useBurntFeesStatistics: useApi = () => {
  return useSWR(
    `${ENV_CONFIG.ENV_OPEN_API_HOST}/statistics/burnt/fee`,
    simpleGetFetcher,
  );
};

const wcfxToken = 'cfx:acg158kvr8zanb1bs048ryb6rtrhr283ma70vz70tx';
const wcfxTestToken = 'cfxtest:achs3nehae0j6ksvy1bhrffsh1rtfrw1f6w1kzv46t';

export const useWCFXTokenInfo: useApi = () => {
  const wcfx = IS_CORESPACE && IS_MAINNET ? wcfxToken : wcfxTestToken;

  const key = `${ENV_CONFIG.ENV_OPEN_API_HOST}/token/tokeninfos?contracts=${wcfx}`;

  return useSWR(key, simpleGetFetcher);
};
