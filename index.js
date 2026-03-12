import { fetchData } from './util/fetchData.util.js';
import { parseHTML, outResultParse } from './util/parseHTML.util.js';

const test = async urlString => {
  const htmlString = await fetchData(urlString);
  const htmlParsing = parseHTML(htmlString);

  outResultParse(htmlParsing, urlString);
};

await test('http://nodejs.org/api/readline.html');
await test('https://glo.academy');
