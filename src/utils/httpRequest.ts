import qs from 'query-string';
import { cfx, cfxFormat } from './cfx';
import { delay } from './index';
import { transferRisk } from './index';
import fetch from './request';

export const apiPrefix = '/v1';
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
