import qs from 'query-string';
// import superagent from 'superagent';
import { cfx, cfxFormat } from './cfx';
import { delay } from './index';
import { transferRisk } from './index';
import { fetch } from './request';

export const apiPrefix = '/v1';
export const sendRequest = config => {
  return fetch(qs.stringifyUrl({ url: config.url, query: config.query }), {
    method: config.type || 'GET',
    body: config.body,
    headers: config.headers,
  }).then(response => response.json());

  // const reqType = config.type || 'GET';
  // const reqPromise = superagent(reqType, config.url)
  //   .set(config.headers || {})
  //   .query(config.query || {})
  //   .send(config.body)
  //   .ok(() => {
  //     return true;
  //   });
  // reqPromise.catch(error => {
  //   //TODO add sentry
  // });
  // return reqPromise;
};

export const reqTransactionDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/${param && param['hash']}`,
    ...extra,
  });
  // .then(res => res.body);
};

export const reqContract = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/contract/${param && param['address']}`,
    query: param,
    ...extra,
  });
  // .then(res => res.body);
};

export const reqTransferList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transfer`,
    query: param,
    ...extra,
  });
  // .then(res => res.body);
};

export const reqTokenList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/token`,
    query: param,
    ...extra,
  });
  // .then(res => res.body);
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
