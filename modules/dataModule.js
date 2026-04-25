import { checkFile, writeJSON, readJSON } from '../helpers/fileSystem.js';

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
const TSYMS = process.env.TSYMS;
const TICKERS_FILE = process.env.TICKERS_FILE;
const QUOTES_FILE = process.env.QUOTES_FILE;
const MAX_QUOTES = process.env.MAX_QUOTES;
const TICKERS_URL = 'data/all/coinlist?summary=true';
const PRICE_URL = 'data/pricemulti';

export const checkingDatabases = async () => {
  let isValid = true;

  if (!(await checkFile(TICKERS_FILE)))
    isValid = await writeJSON(TICKERS_FILE, []);
  if (!isValid) return false;

  if (!(await checkFile(QUOTES_FILE)))
    isValid = await writeJSON(QUOTES_FILE, {});
  return isValid;
};

export const fetchValidTickers = async () => {
  try {
    const url = new URL(TICKERS_URL, API_URL);
    const response = await fetch(url);
    const data = await response.json();
    return Object.keys(data.Data);
  } catch (e) {
    console.error(
      `fetchValidTickers: ошибка при получении данных: ${e.message}`,
    );
    return null;
  }
};

const fetchTickersData = async tickers => {
  try {
    const url = new URL(PRICE_URL, API_URL);
    url.searchParams.set('fsyms', tickers.join(','));
    url.searchParams.set('tsyms', TSYMS);
    url.searchParams.set('api_key', API_KEY);

    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(
      `fetchTickersData: ошибка при получении данных: ${e.message}`,
    );
    return null;
  }
};

const formatedTimestampedData = tickersData => {
  const timestampedData = {};
  const timestamp = Date.now();
  const tsyms = TSYMS.split(',');

  for (const ticker in tickersData) {
    timestampedData[ticker] = { timestamp };
    tsyms.forEach(tsym => {
      timestampedData[ticker][`price_${tsym}`] = tickersData[ticker][tsym];
    });
  }
  return timestampedData;
};

const storeQuotesData = async formatedData => {
  const quotesData = await readJSON(QUOTES_FILE);
  if (!quotesData) return;

  for (const ticker in formatedData) {
    if (!quotesData[ticker]) {
      quotesData[ticker] = [];
    }
    quotesData[ticker].push(formatedData[ticker]);
    if (quotesData[ticker].length > MAX_QUOTES) {
      quotesData[ticker].shift();
    }
  }
  await writeJSON(QUOTES_FILE, quotesData);
};

export const fetchAndStoreData = async tickers => {
  const tickersData = await fetchTickersData(tickers);

  if (tickersData) {
    const formatedData = formatedTimestampedData(tickersData);
    await storeQuotesData(formatedData);
  }
};
