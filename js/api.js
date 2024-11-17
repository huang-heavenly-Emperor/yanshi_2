async function fetchData(url, options = {}) {
  const {
    method = 'GET', // 默认请求方法
    headers = {},   // 请求头
    body,           // 请求体
    timeout = 3000  // 请求超时，默认5秒
  } = options;

  // 创建一个 Promise 来处理超时
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('请求超时'));
    }, timeout);
  });

  // 创建 fetch 请求的 Promise
  const fetchPromise = fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json', // 默认的请求头
      ...headers,
    },
    body: JSON.stringify(body), // 如果有请求体，则转换为 JSON 字符串
  }).then(response => {




    if (!response.ok) {


      
      throw new Error(`网络响应失败，状态码：${response.status}`);
    }
    return response.json();
  });

  // 使用 Promise.race 来处理超时和 fetch 请求
  return Promise.race([fetchPromise, timeoutPromise])
    .catch(error => {
      // 捕获错误并抛出
      throw new Error(`请求失败：${error.message}`);
    });
}

