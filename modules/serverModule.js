import http from 'node:http';
import url from 'node:url';
import { readJSON, writeJSON } from '../helpers/fileSystem.js';

const QUOTES_FILE = process.env.QUOTES_FILE;
const TICKERS_FILE = process.env.TICKERS_FILE;

const NOT_FOUND_MESSAGE = 'Ресурс не найден';
const SERVER_ERROR_MESSAGE = 'Ошибка при обработке запроса';
const INVALID_TICKERS_MESSAGE = 'Невалидные тикеры';
const DELETE_TICKERS_MESSAGE = 'Не указаны тикеры для удаления';
const TICKERS_UPDATED_MESSAGE = 'Тикеры успешно обновлены';
const TICKERS_DELETED_MESSAGE = 'Тикеры успешно удалены';

const processQuotesRequest = async (res, tickersQuery, stepQuery) => {
  const quotesData = await readJSON(QUOTES_FILE);
  if (!quotesData) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  }

  const tickersSelected =
    tickersQuery === null || tickersQuery.trim() === ''
      ? []
      : tickersQuery.replace(/\s+/g, '').toUpperCase().split(',');

  const step = parseInt(stepQuery, 10);

  if (tickersSelected.length > 0 || step) {
    Object.keys(quotesData).forEach(ticker => {
      if (tickersSelected.length > 0 && !tickersSelected.includes(ticker)) {
        delete quotesData[ticker];
      } else if (step > 0) {
        quotesData[ticker] = quotesData[ticker].slice(-step);
      }
    });
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify(quotesData));
};

const processAddTickersRequest = (req, res, currentTickers, validTickers) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    const addTickers = body
      .replace(/[\s\[\]\"]+/g, '')
      .toUpperCase()
      .split(',');
    const uniqueAddTickers = [...new Set(addTickers)];

    const invalidTickers = uniqueAddTickers.filter(
      ticker => !validTickers.includes(ticker),
    );
    if (invalidTickers.length > 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: `${INVALID_TICKERS_MESSAGE}`,
          invalidTickers,
        }),
      );
    }

    const preTickers = [...new Set([...currentTickers, ...uniqueAddTickers])];
    if (await writeJSON(TICKERS_FILE, preTickers)) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          message: `${TICKERS_UPDATED_MESSAGE}`,
          addedTickers: uniqueAddTickers.filter(
            t => !currentTickers.includes(t),
          ),
          updatedTickers: uniqueAddTickers.filter(t =>
            currentTickers.includes(t),
          ),
        }),
      );
      currentTickers.length = 0;
      currentTickers.push(...preTickers);
      return;
    }

    res.writeHead(500, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
  });
};

const processDeleteTickersRequest = async (
  res,
  currentTickers,
  tickersQuery,
) => {
  const tickersToDelete =
    tickersQuery === null || tickersQuery.trim() === ''
      ? []
      : tickersQuery.replace(/\s+/g, '').toUpperCase().split(',');

  if (tickersToDelete.length === 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ message: DELETE_TICKERS_MESSAGE }));
  }

  const uniqueToDeleteTickers = [...new Set(tickersToDelete)];
  const remainingTickers = currentTickers.filter(
    ticker => !uniqueToDeleteTickers.includes(ticker),
  );

  const quotesData = await readJSON(QUOTES_FILE);
  if (quotesData) {
    Object.keys(quotesData).forEach(ticker => {
      if (!remainingTickers.includes(ticker)) {
        delete quotesData[ticker];
      }
    });
  }

  if (
    quotesData &&
    (await writeJSON(TICKERS_FILE, remainingTickers)) &&
    (await writeJSON(QUOTES_FILE, quotesData))
  ) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: TICKERS_DELETED_MESSAGE,
        deletedTickers: uniqueToDeleteTickers.filter(t =>
          currentTickers.includes(t),
        ),
        missingTickers: uniqueToDeleteTickers.filter(
          t => !currentTickers.includes(t),
        ),
      }),
    );
    currentTickers.length = 0;
    currentTickers.push(...remainingTickers);
    return;
  }

  res.writeHead(500, { 'Content-Type': 'application/json' });
  return res.end(JSON.stringify({ message: SERVER_ERROR_MESSAGE }));
};

export const startServer = (currentTickers, validTickers) => {
  const server = http.createServer((req, res) => {
    const method = req.method;
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const query = url.searchParams;

    if (pathname !== '/crypto' || !['GET', 'POST', 'DELETE'].includes(method)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: NOT_FOUND_MESSAGE }));
      return;
    }

    if (method === 'GET') {
      processQuotesRequest(res, query.get('tickers'), query.get('step'));
      return;
    }

    if (method === 'POST') {
      processAddTickersRequest(req, res, currentTickers, validTickers);
      return;
    }

    if (method === 'DELETE') {
      processDeleteTickersRequest(res, currentTickers, query.get('tickers'));
      return;
    }
  });
  return server;
};
