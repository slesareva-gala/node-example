import http from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const sendGetRequestHTML = async (httpModule, options) => {
  try {
    const data = await new Promise((resolve, reject) => {
      const req = httpModule.request(options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      });
      req.on('error', e => {
        reject(e);
      });
      req.end();
    });
    return data;
  } catch (e) {
    console.error(`Ошибка sendGetRequestHTML: ${e}`);
    return '';
  }
};

export const fetchData = async urlString => {
  const parsedUrl = URL.parse(urlString);
  const httpModule = parsedUrl.protocol === 'https:' ? https : http;

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.protocol === 'https:' ? 443 : 80,
    path: parsedUrl.pathname,
    search: parsedUrl.search,
    hash: parsedUrl.hash,
    method: 'GET',
    headers: {
      Accept: 'plain/html',
      'Accept-Encoding': '*',
    },
  };
  return await sendGetRequestHTML(httpModule, options);
};
