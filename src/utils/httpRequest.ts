import superagent from 'superagent';
import { cfx, cfxUtil } from './cfx';
import { delay } from './index';
import { transferRisk } from './index';
export const apiPrefix = '/api';
export const sendRequest = config => {
  const reqType = config.type || 'GET';
  const reqPromise = superagent(reqType, config.url)
    .set(config.headers || {})
    .query(config.query || {})
    .send(config.body)
    .ok(() => {
      return true;
    });
  reqPromise.catch(error => {
    //TODO: upload log to Sentry
  });
  return reqPromise;
};

export const reqTransactionDetail = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transaction/${param && param['hash']}`,
    ...extra,
  }).then(res => res.body);
};

export const reqContract = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/contract/${param && param['address']}`,
    query: param,
    ...extra,
  }).then(res => res.body);
};

export const reqTransferList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/transfer`,
    query: param,
    ...extra,
  }).then(res => res.body);
};

export const reqTokenList = (param?: object, extra?: object) => {
  return sendRequest({
    url: `${apiPrefix}/token`,
    query: param,
    ...extra,
  }).then(res => res.body);
};

export const reqConfirmationRiskByHash = async (blockHash: string) => {
  try {
    const callProvider = () => {
      return cfx.provider.call(
        'cfx_getConfirmationRiskByHash',
        cfxUtil.format.blockHash(blockHash),
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
