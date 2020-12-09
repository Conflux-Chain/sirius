import { PromiseType } from 'react-use/lib/util';
import superagent from 'superagent';

type FetchWithAbortType = Partial<PromiseType<any>> & {
  abort?: () => void;
};

type ErrorHandlerType = {
  code: number | string;
  message?: string;
  data?: any;
};

const windowFetch = window.fetch;

// 默认的请求超时时间 60s
const TIMEOUT_TIMESTAMP = 60000;
// 默认的请求错误码文案
// @todo 具体文案需要写在 locale 里面
const ERROR_CODE_MESSAGE = {
  // 后端错误
  10001: '参数错误，列表参数到达最大值。',
  // 自定义错误
  20000: '未知错误',
  20001: '响应数据解析错误',
  20002: '请求超时',
  20003: '请求中止',
  // http 错误，只选择了常用的，参照 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
  400: '错误请求', // bad request
  401: '未授权', // Unauthorized
  403: '服务器拒绝请求', // Forbidden
  404: '未找到资源', // Not Found
  405: '方法禁用', // Method Not Allowed
  500: '服务器内部错误', // Internal Server Error
  501: '服务器不支持请求的功能', // Not Implemented
  502: '网关错误', // Bad Gateway
  503: '服务不可用', // Service Unavailable
  504: '网关超时', // Gateway Timeout
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
const errorHandler = ({ code = '20000', message, data }: ErrorHandlerType) => {
  // 只有在 ERROR_CODE_MESSAGE 定义的错误才会被捕捉处理
  if (ERROR_CODE.includes(String(code))) {
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
    errorHandler({
      code: response.status,
      message: response.statusText,
    });
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
    errorHandler({
      code: 20001,
    });
    return response;
  }
};

// 添加请求超时功能
const fetchWithTimeout = (url, { timeout: timestamp, ...opts }) => {
  return new Promise((resolve, reject) => {
    var timeout = setTimeout(() => {
      errorHandler({
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
      errorHandler({
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
      return error;
    });
};

// @todo superagent global error handle
const superagentNext = () => {};

window.fetch = fetch;
export { fetch, superagentNext as superagent };
