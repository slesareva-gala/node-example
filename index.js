import http from 'node:http';
import { upload64 } from './modules/sendImage64.js';
import { uploadFD } from './modules/sendImageFD.js';

const PORT = process.env.PORT || 3000;
const URLS = ['/upload', '/upload/64', '/upload/fd'];

const NOT_FOUND_MESSAGE = 'Ресурс не найден';

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  const method = req.method;
  const url = req.url;

  if (!(method === 'POST' && URLS.includes(url))) {
    console.error(NOT_FOUND_MESSAGE);
    res.statusCode = 404;
    return res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
  }

  switch (url) {
    case '/upload':
    case '/upload/64':
      upload64(req, res);
      break;
    case '/upload/fd':
      uploadFD(req, res);
      break;
  }
});

server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
