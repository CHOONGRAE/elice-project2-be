import axios from 'axios';

axios.defaults.timeout = 10 * 1000;
axios.defaults.maxRedirects = 0;

const makeHeaders = (origin: string) => {
  const headers = {};

  if (/(coupang)/i.test(origin)) {
    headers['User-Agent'] = 'facebookexternalhit/1.1;kakaotalk-scrap/1.0;';
  }

  return headers;
};

const makeAxios = (origin: string) => {
  const headers = makeHeaders(origin);

  return axios.create({
    headers,
  });
};

export const requests = async (url: string) => {
  const { origin, pathname } = new URL(url);

  const trimedUrl = origin + pathname;

  const customAxios = makeAxios(origin);

  const response = (await customAxios.get(trimedUrl)).data;

  return response;
};
