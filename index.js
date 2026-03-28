#!/usr/bin/env node

import { argsParse } from './util/argsParse.util.js';
import { argsValidation } from './service/argsValidation.service.js';
import { fetchNews } from './util/fetchNews.util.js';
import { sayNews } from './util/sayNews.util.js';

const app = async () => {
  const args = argsParse(process.argv);

  if (args.h) {
    console.log(`
      Управляющая команда (команды запроса игнорируются)
      -h │ показать список команд запроса новостей

      Команды запроса новостей
      -q | ключевые слова или фраза для поиска
      -c | категории новостей: business entertainment general health science sports technology
      -l | язык новостей: ar de en es fr he it nl no pt ru sv ud zh
      -s | количество результатов, возвращаемых на страницу (запрос): по умолчанию - 10, максимальное - 100.
      `);
    return;
  }

  const options = {
    q: '',
    l: 'en',
    c: '',
    s: '10',
  };
  Object.keys(options).forEach(key => {
    if (args[key]) options[key] = args[key];
  });

  if (argsValidation(options)) {
    sayNews(await fetchNews(options));
  }
};

app();
