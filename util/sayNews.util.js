import { sayTitle, sayComment } from '../service/sayMessage.service.js';

export const sayNews = news => {
  if (news === null) return;

  if (news.length === 0) {
    console.log('По вашему запросу новости не найдены');
    return;
  }
  news.forEach(data => {
    const publishedAt = data.publishedAt
      .slice(0, 10)
      .split('-')
      .reverse()
      .join('.');
    sayTitle(data.title);
    console.log(data.description);
    sayComment(`${publishedAt} автор: ${data.author}`);
    sayComment(`${data.url}\n`);
  });
};
