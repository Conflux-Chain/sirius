import { PromiseType } from 'react-use/lib/util';
import pubsub from 'utils/pubsub';

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
const BACKEND_ERROR_CODE_BLACKLIST = [10001];

// 异常消息发布
const notify = ({ code, message }: NotifyType) => {
  pubsub.publish('notify', {
    code,
    message,
  });
};

// 检查 http status
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    notify({
      code: response.status,
      message: response.statusText,
    });
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

// 格式化 response data
const parseJSON = response => {
  const contentType = response.headers.get('content-type');
  try {
    if (contentType.includes('application/json')) {
      return response.json();
    } else if (contentType.includes('text/html')) {
      return response.text();
    } else {
      // contentType 还有其他类型，目前项目中用不到
      // 不能简单的报错，比如 image/x-icon 是 favicon 请求
      // 此处直接返回 response，由业务代码处理其他类型的数据
      return response;
    }
  } catch (error) {
    notify({
      code: 20001,
    });
    error.response = response;
    throw error;
  }
};

// 检查返回值中是否包含错误
const checkResponse = data => {
  const code = Number(data?.code);
  // 只过滤黑名单中的，其他的错误透传到业务代码中处理
  if (BACKEND_ERROR_CODE_BLACKLIST.includes(code)) {
    notify({
      code: code,
      message: data.message,
    });
    const error: Partial<ErrorEvent> & {
      response?: ResponseType;
    } = new Error(data.message);
    error.response = data;
    throw error;
  }
  return data;
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
        notify({
          code: 20004,
        });
      }
      throw error;
    });
};

window.fetch = fetch;
export default fetch;
