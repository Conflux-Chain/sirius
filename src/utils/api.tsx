import useSWR from 'swr';

export const dynamicSWRFetcher = async ([input, init]) => {
  const res = await fetch(input, init);
  let result: any;

  try {
    result = await res.json();
  } catch {
    (result as string) = await res.text();
  } finally {
    (result as Blob) = await res.blob();
  }

  return result;
};

const appendApiPrefix = (url: string) => `/api${url}`;

interface Params {
  [name: string]: string;
}

const simpleGetFetcher = async (args: any[]) => {
  const [url, params] = args;
  const body = new FormData();
  if (params) {
    Object.keys(params).forEach(k => {
      body.append(k, params[k]);
    });
  }

  const res = await fetch(appendApiPrefix(url), { method: 'get', body });
  const json = await res.json();
  return json;
};

export const useDashboardDag = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/dag', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardEpoch = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/epoch', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardPlot = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/plot', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useDashboardTrend = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/dashboard/trend', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useAddressQuery = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/address/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockList = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/block/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useBlockQuery = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/block/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTransactionList = (params?: Params | any[], ...rest: any[]) => {
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
export const useTransferList = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/transfer/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useContractList = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/contract/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenList = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/token/list', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useTokenQuery = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/token/query', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
export const useUtilType = (params?: Params | any[], ...rest: any[]) => {
  if (!Array.isArray(params)) params = [params];
  return useSWR(
    ['/util/type', ...params],
    rest[1] || simpleGetFetcher,
    rest[0],
  );
};
