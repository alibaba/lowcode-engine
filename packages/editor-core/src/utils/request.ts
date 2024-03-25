export function serialize(obj?: object): string {
  if (!obj) {
    return '';
  }
  const rst: string[] = [];
  Object.entries(obj || {}).forEach(([key, val]): void => {
    if (val === null || val === undefined || val === '') return;
    if (typeof val === 'object') rst.push(`${key}=${encodeURIComponent(JSON.stringify(val))}`);
    else rst.push(`${key}=${encodeURIComponent(val)}`);
  });
  return rst.join('&');
}

export function buildUrl(dataAPI: string, params?: object): string {
  const paramStr = serialize(params);
  if (paramStr) {
    return dataAPI.indexOf('?') > 0 ? `${dataAPI}&${paramStr}` : `${dataAPI}?${paramStr}`;
  }
  return dataAPI;
}

export function get(
  dataAPI: string,
  params?: object,
  headers?: object,
  otherProps?: object,
): Promise<any> {
  const fetchHeaders = {
    Accept: 'application/json',
    ...headers,
  };
  return request(buildUrl(dataAPI, params), 'GET', undefined, fetchHeaders, otherProps);
}

export function post(
  dataAPI: string,
  params?: object,
  headers?: object,
  otherProps?: object,
): Promise<any> {
  const fetchHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
    ...headers,
  };
  return request(
    dataAPI,
    'POST',
    fetchHeaders['Content-Type'].indexOf('application/json') > -1 || Array.isArray(params)
      ? JSON.stringify(params)
      : serialize(params),
    fetchHeaders,
    otherProps,
  );
}

export function request(
  dataAPI: string,
  method = 'GET',
  data?: object | string,
  headers?: object,
  otherProps?: any,
): Promise<any> {
  return new Promise((resolve, reject): void => {
    if (otherProps && otherProps.timeout) {
      setTimeout((): void => {
        reject(new Error('timeout'));
      }, otherProps.timeout);
    }
    fetch(dataAPI, {
      method,
      credentials: 'include',
      headers,
      body: data,
      ...otherProps,
    })
      .then((response: Response): any => {
        switch (response.status) {
          case 200:
          case 201:
          case 202:
            return response.json();
          case 204:
            if (method === 'DELETE') {
              return {
                success: true,
              };
            } else {
              return {
                __success: false,
                code: response.status,
              };
            }
          case 400:
          case 401:
          case 403:
          case 404:
          case 406:
          case 410:
          case 422:
          case 500:
            return response
              .json()
              .then((res: object): any => {
                return {
                  __success: false,
                  code: response.status,
                  data: res,
                };
              })
              .catch((): object => {
                return {
                  __success: false,
                  code: response.status,
                };
              });
          default:
            return null;
        }
      })
      .then((json: any): void => {
        if (json && json.__success !== false) {
          resolve(json);
        } else {
          delete json.__success;
          reject(json);
        }
      })
      .catch((err: Error): void => {
        reject(err);
      });
  });
}
