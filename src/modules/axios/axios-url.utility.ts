// eslint-disable-next-line @typescript-eslint/no-require-imports
// const { queryString } = require('query-string');
// import URI from 'uri-js';
// import queryString from 'query-string';

// import { stringifyUrl } from 'query-string/base';

export const AxiosURLConstruction = (baseUrl: string, params: any) => {
  const searchParams = new URLSearchParams(params);
  return `${baseUrl}${baseUrl.includes('&') ? '&' : '?'}${searchParams.toString()}`;
};
