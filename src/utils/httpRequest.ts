import qs from 'query-string';
import fetch from './request';

export const apiPrefix = '/v1';
export const statPrefix = '/stat';
export const sendRequest = config => {
  return fetch(qs.stringifyUrl({ url: config.url, query: config.query }), {
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
    url: `${apiPrefix}/eventLog`,
    query: param,
    ...extra,
  });
};

export const reqBlockDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/block/${param && param['hash']}`,
    ...extra,
  });
};

export const reqTransactionDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/${param && param['hash']}`,
    query: extra,
  });
};

export const reqContract = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/contract/${param && param['address']}`,
    query: param,
    ...extra,
  });
};

export const reqContractAndToken = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/contract-and-token`,
    query: param,
    ...extra,
  });
};

export const reqTransferList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transfer`,
    query: param,
    ...extra,
  });
};

export const reqTokenList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/token`,
    query: param,
    ...extra,
  });
};

export const reqToken = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/token/${param && param['address']}`,
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
    url: `${apiPrefix}/supply`,
    ...extra,
  });
};

export const reqHomeDashboard = (extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/homeDashboard`,
    ...extra,
  });
};

export const reqContractNameTag = (name: string, extra?: object) => {
  return sendRequest({
    url: `${statPrefix}/contract/registered/name?name=${name}`,
    ...extra,
  });
};
