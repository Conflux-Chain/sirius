import useSWR, { responseInterface } from 'swr';
import qs from 'query-string';

export const appendApiPrefix = (url: string) => `/api${url}`;

export interface Params {
  [name: string]: string;
}

export type useApi = (
  params?: Params | any[],
  ...rest: any[]
) => responseInterface<any, any>;

const simpleGetFetcher = async (...args: any[]) => {
  let [url, query] = args;
  if (query) {
    url = qs.stringifyUrl({ url, query });
  }

  const res = await fetch(appendApiPrefix(url), {
    method: 'get',
  });
  const json = await res.json();
  return json;
};

const simplePostFetcher = async (...args: any[]) => {
  let [url, params] = args;
  const body = new FormData();
  if (params) {
    Object.keys(params).forEach(k => {
      body.append(k, params[k]);
    });
  }

  const res = await fetch(appendApiPrefix(url), {
    method: 'post',
    body,
  });
  const json = await res.json();
  return json;
};

export const useDashboardDag: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/dag', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardEpoch: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/epoch', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardPlot: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/plot', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardTrend: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/trend', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useAddressQuery: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/address/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/block/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockQuery: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/block/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransactionList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/transaction/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransactionQuery = (
  params?: Params | any[],
  ...rest: any[]
) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/transaction/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransferList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/transfer/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useContractList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/token/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenQuery: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/token/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useUtilType: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/util/type', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};

export const useCMAccountTokenList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/account/token/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractQuery: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/contract/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractList: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/contract/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useCMContractCreate: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/contract/create', ...params],
    rest[1] || simplePostFetcher,
    rest[0],
  );
};
export const useCMContractUpdate: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/contract/update', ...params],
    rest[1] || simplePostFetcher,
    rest[0],
  );
};
export const useCMContractDelete: useApi = (params, ...rest) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract-manager/contract/delete', ...params],
    rest[1] || simplePostFetcher,
    rest[0],
  );
};
