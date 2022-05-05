import { PromiseType } from 'react-use/lib/util';
import { appendApiPrefix } from './api';
import { publishRequestError } from './index';
import lodash from 'lodash';

type FetchWithAbortType = Partial<PromiseType<any>> & {
  abort?: () => void;
};

type NotifyType = {
  code: number;
  message?: string;
};

// 暂存默认 window fetch
const windowFetch = window.fetch;
// 默认的请求超时时间 60s
const TIMEOUT_TIMESTAMP = 60000;

// 只有在此列表内的后端错误需要 Notification 提示，其他的会在业务代码里处理
// const BACKEND_ERROR_CODE_BLACKLIST = [
//   10001,
//   10403,
//   10501,
//   10503,
//   40414,
//   40400,
//   40404,
//   50404,
//   50600,
//   50601,
// ];

// 检查 http status
const checkStatus = response => {
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status === 600
  ) {
    return response;
  } else {
    publishRequestError(
      { code: response.status, message: response.statusText },
      'http',
    );
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

// 格式化 response data
const parseJSON = async function (response) {
  const contentType = response.headers.get('content-type');
  try {
    if (contentType.includes('application/json')) {
      return { data: await response.json(), response };
    } else if (contentType.includes('text/html')) {
      return { data: await response.text(), response };
    } else {
      // contentType 还有其他类型，目前项目中用不到
      // 不能简单的报错，比如 image/x-icon 是 favicon 请求
      // 此处直接返回 response，由业务代码处理其他类型的数据
      return { data: response, response };
    }
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      return { data: response, response };
    }
    publishRequestError({ code: 20001 }, 'http');
    (error as any).response = response;
    throw error;
  }
};

// 检查返回值中是否包含错误
const checkResponse = ({ data, response }) => {
  // compatible with open api request
  if (response.status === 200 && lodash.isNil(data.code)) {
    return data;
  } else if (data.code === 0) {
    return data.data;
  } else {
    const code = Number(data?.code);
    publishRequestError({ code: code, message: data.message }, 'http');
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(data.message);
    error.response = data;
    throw error;
  }
};

// 添加请求超时功能
const fetchWithTimeout = (url, { timeout: timestamp, ...opts }) => {
  return new Promise((resolve, reject) => {
    var timeout = setTimeout(() => {
      publishRequestError({ code: 20002 }, 'http');
      reject(new Error('fetch timeout'));
    }, timestamp || TIMEOUT_TIMESTAMP);
    windowFetch(url, opts)
      .then(response => {
        clearTimeout(timeout);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeout);
        reject(error);
      });
  });
};

// 添加请求中断
const fetchWithAbort = (url, opts) => {
  return new Promise((resolve, reject) => {
    const abortPromise = () => {
      publishRequestError({ code: 20003 }, 'http');
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
const fetch = (url, opts = {}) => {
  return fetchWithAbort(url, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResponse)
    .catch(error => {
      // 添加错误请求日志输出，或者收集统计信息

      // A fetch() promise will reject with a TypeError when a network error is encountered or CORS is misconfigured on the server-side,
      // although this usually means permission issues or similar — a 404 does not constitute a network error, for example.
      // For detail: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      if (error.name === 'TypeError') {
        publishRequestError({ code: 20004 }, 'http');
      }
      throw error;
    });
};

export default fetch;

export const fetchWithPrefix = (url, opts?) => {
  return fetch(appendApiPrefix(url), opts);
};
