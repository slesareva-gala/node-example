import 'dotenv/config';
import { readJSON } from './helpers/fileSystem.js';
import {
  checkingDatabases,
  fetchValidTickers,
  fetchAndStoreData,
} from './modules/dataModule.js';
import { startServer } from './modules/serverModule.js';

const PORT = process.env.PORT || 3000;
const TICKERS_FILE = process.env.TICKERS_FILE;

const isDatabasesReady = await checkingDatabases();
const validTickers = await fetchValidTickers();
const currentTickers = await readJSON(TICKERS_FILE);

if (isDatabasesReady && validTickers && currentTickers) {
  const server = startServer(currentTickers, validTickers);
  server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });

  setInterval(async () => {
    if (currentTickers.length > 0) await fetchAndStoreData(currentTickers);
  }, 5000);
}
