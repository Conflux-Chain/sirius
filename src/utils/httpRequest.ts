import qs from 'query-string';
import fetch from './request';
import { OPEN_API_URLS } from './constants';

export const v1Prefix = '/v1';
export const statPrefix = '/stat';

export const sendRequest = config => {
  const url =
    config.url.startsWith('/stat') || config.url.startsWith('http')
      ? config.url
      : `${v1Prefix}${
          config.url.startsWith('/') ? config.url : '/' + config.url
        }`;
  return fetch(qs.stringifyUrl({ url: url, query: config.query }), {
    method: config.type || 'GET',
    body: config.body,
    headers: config.headers,
  });
};

export const reqReport = (param?: object) => {
  return sendRequest({
    url: `${statPrefix}/recaptcha/siteverify`,
    type: 'POST',
    body: JSON.stringify(param),
    headers: {
      'Content-Type': 'application/json',
    },
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

export const reqContract = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/contract/${param && param['address']}`,
    query: param,
    ...extra,
  });
};

export const reqContractAndToken = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/contract-and-token`,
    query: param,
    ...extra,
  });
};

export const reqTransferList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `/transfer`,
    query: param,
    ...extra,
  });
};

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

export const reqCfxSupply = (extra?: object) => {
  return sendRequest({
    url: `/supply`,
    ...extra,
  });
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

export const reqContractLicense = () => {
  return sendRequest({
    url: `/contract/license`,
  });
};

export const reqContractCompiler = () => {
  return sendRequest({
    url: `/contract/compiler`,
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

export const reqTransactions = (extra?: object) => {
  return sendRequest({
    url: `/transaction`,
    ...extra,
  });
};

export const reqNFTInfo = (extra?: object) => {
  // ?contractAddress=cfx:acb3fcbj8jantg52jbg66pc21jgj2ud02pj1v4hkwn&tokenId=424873
  return sendRequest({
    url: `/stat/nft/checker/preview`,
    ...extra,
  });
};

export const reqNFTDetail = (extra?: object) => {
  return sendRequest({
    url: `/stat/nft/checker/detail`,
    ...extra,
  });
};

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

export const reqPoSAccount = (extra?: object) => {
  return sendRequest({
    url: `/stat/pos-account-detail`,
    ...extra,
  });
};

export const reqPoSIncomingHistory = (extra?: object) => {
  return sendRequest({
    url: `/stat/list-pos-account-reward`,
    ...extra,
  });
};

export const reqNFT1155Tokens = (extra?: object) => {
  return sendRequest({
    url: `/stat/nft/list1155inventory`,
    ...extra,
  });
};

/** open api, start */

/** charts, start */

export const reqChartData = ({ url, query }) => {
  return sendRequest({
    url,
    query,
  });
};

/** charts, end */

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

/** open api, end */
