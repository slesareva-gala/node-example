#!/usr/bin/env node

import { argsParse } from './util/argsParse.js';
import { validate } from './util/validate.js';
import { execution } from './util/execution.js';

const app = async () => {
  const args = argsParse(process.argv, {
    help: '',
    pack: 'file',
    unpack: 'file',
  });

  if (!args) {
    console.log(`Ошибочная команда. Подробнее: 'gz help'\n`);
    return;
  }

  if (args.command === 'help') {
    console.log(`
Архиватор с хэш-контролем. Вызов:
gz <команда> [параметры команды]

Список команд gz:
─────────────────────────┐
  [help]                 │  показать описание команд gz
  pack 'путь к файлу'    │  создать хэш .sha256  и сжать в архив .gz файл
                         │     / хеш и архив сохраняются в каталоге файла
  unpack 'путь к архиву' │  распаковать архив .gz и проверить целостность
                         │  данных по хэшу оригинала

Список параметров:
─────────────────────────┐
        'путь к файлу'   │  полное имя файла
        'путь к архиву'  │  полное имя архива файла
  `);

    return;
  }

  if (!(await validate(args))) return;

  execution(args);
};

app();
