import qs from 'query-string';
import { fetch } from '@cfxjs/sirius-next-common/dist/utils/request';
import { OPEN_API_URLS } from './constants';
import { fetchNFTMetadata } from '@cfx-kit/dapp-utils/dist/metadata';
import ENV_CONFIG from 'env';
import { fetchWithCache } from '@cfxjs/sirius-next-common/dist/utils/cache';

const v1Prefix = '/v1';
const statPrefix = '/stat';

export const sendRequest = config => {
  const url =
    config.url.startsWith('/stat') || config.url.startsWith('http')
      ? config.url
      : `${v1Prefix}${
          config.url.startsWith('/') ? config.url : '/' + config.url
        }`;
  return fetch<any>(qs.stringifyUrl({ url: url, query: config.query }), {
    method: config.type || 'GET',
    body: config.body,
    headers: config.headers,
    signal: config.signal,
    showErrorMessage: config.showErrorMessage,
  });
};

export const reqTransactionEventlogs = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/eventLog`,
    query: param,
    ...extra,
  });
};

export const reqBlockDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/block/${param && param['hash']}`,
    ...extra,
  });
};

export const reqTransactionDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/transaction/${param && param['hash']}`,
    query: extra,
  });
};

export const reqContract = fetchWithCache(
  (param?: object, extra?: object) => {
    return sendRequest({
      url: `/contract/${param && param['address']}`,
      query: param,
      ...extra,
    });
  },
  {
    key: 'contract',
    maxAge: 1000 * 60 * 60,
  },
);

export const reqTokenList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/token`,
    query: param,
    ...extra,
  });
};

export const reqTokenListByName = (param?: object, extra?: object) => {
  return sendRequest({
    url: '/stat/tokens/name',
    query: param,
    ...extra,
  });
};

export const reqToken = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/token/${param && param['address']}`,
    query: param,
    ...extra,
  });
};

export const reqTopStatistics = (param: any, extra?: object) => {
  if (
    ['cfxSend', 'cfxReceived', 'txnSend', 'txnReceived'].includes(param.action)
  ) {
    return sendRequest({
      url: `${statPrefix}/tx/top-by-type`,
      query: {
        span: param.span.slice(0, -1),
        type: param.span.slice(-1),
        action: param.action,
        rows: 10,
      },
      ...extra,
    });
  } else if (['topMiner'].includes(param.action)) {
    return sendRequest({
      url: `${statPrefix}/miner/top-by-type`,
      query: {
        span: param.span.slice(0, -1),
        type: param.span.slice(-1),
        rows: 10,
      },
      ...extra,
    });
  } else if (['top-gas-used'].includes(param.action)) {
    return sendRequest({
      url: `${statPrefix}/top-gas-used`,
      query: {
        span: param.span,
        rows: 10,
      },
      ...extra,
    });
  } else if (['overview'].includes(param.action)) {
    return sendRequest({
      url: `${statPrefix}/recent-overview`,
      query: {
        days: param.span === '24h' ? '1' : param.span.slice(0, -1),
      },
      ...extra,
    });
  } else {
    // rank_contract_by_number_of_participants_1d;
    // rank_contract_by_number_of_participants_3d;
    // rank_contract_by_number_of_participants_7d;
    // rank_contract_by_number_of_participants_30d;
    // rank_contract_by_number_of_receivers_1d;
    // rank_contract_by_number_of_receivers_3d;
    // rank_contract_by_number_of_receivers_7d;
    // rank_contract_by_number_of_receivers_30d;
    // rank_contract_by_number_of_senders_1d;
    // rank_contract_by_number_of_senders_3d;
    // rank_contract_by_number_of_senders_7d;
    // rank_contract_by_number_of_senders_30d;
    // rank_contract_by_number_of_transfers_1d;
    // rank_contract_by_number_of_transfers_3d;
    // rank_contract_by_number_of_transfers_7d;
    // rank_contract_by_number_of_transfers_30d;
    let span = param.span;
    if (param.span === '24h') span = '1d';
    return sendRequest({
      url: `${statPrefix}/top-cfx-holder`,
      query: {
        type: `${param.action}_${span}`,
        limit: 10,
      },
      ...extra,
    });
  }
};

export const reqHomeDashboard = (extra?: object) => {
  return sendRequest({
    url: `/homeDashboard`,
    ...extra,
  });
};

export const reqContractNameTag = (name: string, extra?: object) => {
  return sendRequest({
    url: `${statPrefix}/contract/registered/name?name=${name}`,
    ...extra,
  });
};

export const reqContractCodeFormat = () => {
  return sendRequest({
    url: `/contract/code-format`,
  });
};

export const reqContractLicense = () => {
  return sendRequest({
    url: `/contract/license`,
  });
};

export const reqSolidityContractCompiler = () => {
  return sendRequest({
    url: `/contract/compiler`,
  });
};

export const reqVyperContractCompiler = () => {
  return sendRequest({
    url: `/contract/vyper-compiler`,
  });
};

export const reqEVMVersion = () => {
  return sendRequest({
    url: `/contract/evm-version`,
  });
};

export const reqContractVerification = param => {
  return sendRequest({
    url: `/contract/verify`,
    type: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const reqContractCrossSpaceSimilarMatch = param => {
  return sendRequest({
    url: `/contract/verify/cross-space`,
    type: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const reqNFTInfo = fetchWithCache(
  (extra?: object) => {
    // ?contractAddress=cfx:acb3fcbj8jantg52jbg66pc21jgj2ud02pj1v4hkwn&tokenId=424873
    return sendRequest({
      url: `/stat/nft/checker/preview`,
      ...extra,
    });
  },
  {
    key: 'nft-preview',
    maxAge: 1000 * 60 * 10,
  },
);

export const _reqNFTDetail = (extra?: object) => {
  return sendRequest({
    url: `/stat/nft/checker/detail`,
    ...extra,
  });
};
export const reqNFTDetail = ({
  address,
  tokenId,
  formatServerError,
  contractType,
}: {
  address?: string;
  tokenId?: string;
  formatServerError?: (error: unknown, metadata?: object | undefined) => any;
  contractType?: Parameters<typeof fetchNFTMetadata>[0]['contractType'];
}) =>
  fetchNFTMetadata({
    fetchServer: () =>
      _reqNFTDetail({
        query: { contractAddress: address, tokenId },
      }),
    formatServerError,
    nftAddress: address,
    tokenId,
    rpcServer: ENV_CONFIG.ENV_RPC_SERVER,
    method: 'cfx_call',
    contractType,
    formatContractMetadata: metadata => ({ detail: { metadata } }),
  });

export const reqProjectConfig = (extra?: object) => {
  return sendRequest({
    url: '/frontend',
    ...extra,
  });
};

export const reqTokensOfAccountTransfered = (extra?: object) => {
  return sendRequest({
    url: '/stat/tokens/list/latest',
    ...extra,
  });
};

export const reqTransferTPS = (extra?: object) => {
  return sendRequest({
    url: `/stat/transfer/tps`,
    ...extra,
  });
};

export const reqTransferPlot = (extra?: object) => {
  return sendRequest({
    url: `/plot?interval=133&limit=7`,
    ...extra,
  });
};

export const reqHomeDashboardOfPOSSummary = (extra?: object) => {
  return sendRequest({
    url: `/stat/pos-info`,
    ...extra,
  });
};

export const reqPoSAccountOverview = (extra?: object) => {
  return sendRequest({
    url: `/stat/pos-account-overview`,
    ...extra,
  });
};

/** open api, start */

export const reqNFTTokens = (extra?: object) => {
  return sendRequest({
    url: OPEN_API_URLS.NFTTokens,
    ...extra,
  });
};

export const reqNFTBalance = (extra?: object) => {
  return sendRequest({
    url: OPEN_API_URLS.NFTBalance,
    ...extra,
  });
};

export const reqApprovals = (extra?: object) => {
  return sendRequest({
    url: OPEN_API_URLS.approvals,
    ...extra,
  });
};

/** open api, end */

export const reqPendingTxs = (extra?: object) => {
  return sendRequest({
    url: `/stat/transaction/pending`,
    ...extra,
  });
};

export const reqRefreshMetadata = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/stat/nft/checker/refresh`,
    query: param,
    ...extra,
  });
};

// different from ens
// maybe send one request, to get all info is better (ens info, nametag info, contract info, token info)
export const reqNametag = (address: string[], extra?: object) => {
  const query = address.reduce((prev, curr, index) => {
    return !index ? `address=${curr}` : `${prev}&address=${curr}`;
  }, '');

  return sendRequest({
    url: `/nametag?${query}`,
    ...extra,
  });
};
