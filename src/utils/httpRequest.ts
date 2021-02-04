import qs from 'query-string';
import { cfx, cfxFormat } from './cfx';
import { delay } from './index';
import { transferRisk } from './index';
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

export const reqTransactionDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/${param && param['hash']}`,
    ...extra,
  });
};

export const reqContract = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/contract/${param && param['address']}`,
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

export const reqConfirmationRiskByHash = async (blockHash: string) => {
  try {
    const callProvider = () => {
      return cfx.provider.call(
        'cfx_getConfirmationRiskByHash',
        cfxFormat.blockHash(blockHash),
      );
    };
    let result = await callProvider();
    if (!result) {
      // retry when result is null or empty
      await delay(3000);
      result = await callProvider();
    }
    if (result) {
      return transferRisk(result.toString());
    }
    return '';
  } catch (e) {
    return '';
  }
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
