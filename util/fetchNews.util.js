import 'dotenv/config';

const API_KEY = process.env.API_KEY;

async function fetchData(queryString, section = '') {
  try {
    const resource = `https://newsapi.org/v2/top-headlines${section ? `/${section}` : ''}?${queryString}&apiKey=${API_KEY}`;
    const response = await fetch(resource);
    const data = await response.json();
    return (section ? data.sources : data.articles) || [];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const fetchNews = async args => {
  const queryArray = [`language=${args.l}`];
  if (args.c) queryArray.push(`category=${args.c}`);

  if (args.l === 'en') {
    if (args.q) queryArray.push(`q=${args.q}`);
    if (args.s) queryArray.push(`pageSize=${args.s}`);
    return await fetchData(queryArray.join('&'));
  }

  const sources = await fetchData(queryArray.join('&'), 'sources');
  if (sources === null || sources.length === 0) return sources;

  queryArray.length = 0;
  if (sources.length > 10) sources.length = 10;
  queryArray.push(`sources=${sources.map(el => el.id).join(',')}`);
  if (args.q) queryArray.push(`q=${args.q}`);
  if (args.s) queryArray.push(`pageSize=${args.s}`);
  return await fetchData(queryArray.join('&'));
};
