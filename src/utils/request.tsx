import React from 'react';
import { PromiseType } from 'react-use/lib/util';
import superagent from 'superagent';
import { Translation } from 'react-i18next';
import { translations } from 'locales/i18n';

type FetchWithAbortType = Partial<PromiseType<any>> & {
  abort?: () => void;
};

type NotifyType = {
  code: number | string;
  message?: string;
};

const translationsErrors = translations.general.error;

// 暂存默认 window fetch
const windowFetch = window.fetch;

// 默认的请求超时时间 60s
const TIMEOUT_TIMESTAMP = 60000;
// 默认的请求错误码文案
const ERROR_CODE_MESSAGE = {
  // 后端错误
  10001: <Translation>{t => t(translationsErrors[10001])}</Translation>, // The list parameter reached the maximum value.
  // 自定义错误
  20000: <Translation>{t => t(translationsErrors[20000])}</Translation>, // Unknow error.
  20001: <Translation>{t => t(translationsErrors[20001])}</Translation>, // Response data parsing error.
  20002: <Translation>{t => t(translationsErrors[20002])}</Translation>, // Request timeout.
  // 20003: <Translation>{t => t(translationsErrors[20003])}</Translation>, // Request abort. Commonly by manully abort, no need to notify
  // http 错误，只选择了常用的，参照 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
  400: <Translation>{t => t(translationsErrors[400])}</Translation>, // bad request
  401: <Translation>{t => t(translationsErrors[401])}</Translation>, // Unauthorized
  403: <Translation>{t => t(translationsErrors[403])}</Translation>, // Forbidden
  404: <Translation>{t => t(translationsErrors[404])}</Translation>, // Not Found
  405: <Translation>{t => t(translationsErrors[405])}</Translation>, // Method Not Allowed
  500: <Translation>{t => t(translationsErrors[500])}</Translation>, // Internal Server Error
  501: <Translation>{t => t(translationsErrors[501])}</Translation>, // Not Implemented
  502: <Translation>{t => t(translationsErrors[502])}</Translation>, // Bad Gateway
  503: <Translation>{t => t(translationsErrors[503])}</Translation>, // Service Unavailable
  504: <Translation>{t => t(translationsErrors[504])}</Translation>, // Gateway Timeout
};
const ERROR_CODE = Object.keys(ERROR_CODE_MESSAGE);

/**
 * 全局异常处理，所有的 error 都会透传到业务逻辑中，此处不做统一格式处理（后期根据需要可以加上），只是通过 Notification 展示错误
 * @param {Object} option
 * @param {string|number} option.code 错误码
 * @param {string} option.message 自定义错误信息
 * @param {*} option.data 返回值
 * @return void
 */
const notify = ({ code = '20000' }: NotifyType) => {
  // 只有在 ERROR_CODE_MESSAGE 定义的错误才会被捕捉处理
  if (ERROR_CODE.includes(String(code))) {
    // @todo show Notification
    console.log(
      'global notification message: ',
      code,
      ERROR_CODE_MESSAGE[code],
    );
  } else {
    console.log('global notification message: ', ERROR_CODE_MESSAGE['20000']);
  }
};

// 检查 http status
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    notify({
      code: response.status,
    });
    // const error: Partial<ErrorEvent> & {
    //   response?: ResponseType;
    // } = new Error(response.statusText);
    // error.response = response;
    // throw error;
    return response;
  }
};

// 格式化 response data
const parseJSON = response => {
  const contentType = response.headers.get('content-type');
  try {
    if (contentType.includes('application/json')) {
      // response.json(); // 只能执行一次，此处无法验证 .json() 是否报错
    } else if (contentType.includes('text/html')) {
      // response.text(); // 只能执行一次，此处无法验证 .text() 是否报错
    } else {
      throw new Error(`Sorry, content-type ${contentType} not supported`);
    }
    return response;
  } catch (error) {
    notify({
      code: 20001,
    });
    // error.response = response;
    // throw error;
    return response;
  }
};

// 添加请求超时功能
const fetchWithTimeout = (url, { timeout: timestamp, ...opts }) => {
  return new Promise((resolve, reject) => {
    var timeout = setTimeout(() => {
      notify({
        code: 20002,
      });
      reject(new Error('fetch timeout'));
    }, timestamp || TIMEOUT_TIMESTAMP);
    windowFetch(url, opts).then(
      response => {
        clearTimeout(timeout);
        resolve(response);
      },
      error => {
        clearTimeout(timeout);
        reject(error);
      },
    );
  });
};

// 添加请求中断
const fetchWithAbort = (url, opts) => {
  return new Promise((resolve, reject) => {
    const abortPromise = () => {
      notify({
        code: 20003,
      });
      reject(new Error('fetch abort'));
    };
    const p: FetchWithAbortType = fetchWithTimeout(url, opts).then(
      resolve,
      reject,
    );
    p.abort = abortPromise;
    return p;
  });
};

// 添加请求日志输出
const fetch = (url, opts = {}) => {
  return fetchWithAbort(url, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => {
      console.log('request succeeded with JSON response', data);
      return data;
    })
    .catch(error => {
      console.log('request failed', error);
      throw error;
    });
};

// @todo superagent global error handle
const superagentNext = () => {};

window.fetch = fetch;
export { fetch, superagentNext as superagent };
