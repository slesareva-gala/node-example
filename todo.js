#!/usr/bin/env node

import { argsParse } from './util/argsParse.js';
import { validate } from './util/validate.js';
import { execution } from './util/execution.js';

const app = () => {
  const args = argsParse(process.argv, {
    help: '',
    add: 'task',
    list: '',
    get: 'id',
    update: 'id, newTask',
    status: 'id, status',
    delete: 'id',
  });

  if (!args) {
    console.log(`Ошибочная команда. Подробнее: 'todo help'\n`);
    return;
  }

  if (args.command === 'help') {
    console.log(`
Вызов программы To-Do List
────────────────────────────────────
  todo <команда> [параметры команды]

Список команд todo:
───────────────────────┐
  help                 │  показать описание команд todo
  add <задача>         │  добавить задачу
  list                 │  показать список задач
  get <ид>             │  показать задачу по идентификатору
  update <ид> <задача> │  обновить задачу по идентификатору
  status <ид> <статус> │  обновить статус задачи по идентификатору
  delete <ид>          │  удалить задачу по идентификатору

Список параметров:
───────────────────────┐
                 <ид>  │  идентификатор задачи сообщается при добавлении
             <задача>  │  описание дел и задач
             <статус>  │  описание состояния задачи, до 15 символов
  `);

    return;
  }

  if (!validate(args)) return;

  execution(args);
};

app();
