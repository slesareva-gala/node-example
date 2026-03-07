import { read, write, remove } from './files.system.js';
import os from 'node:os';
import path from 'node:path';

const makePath = (file, isHome) =>
  isHome ? path.join(os.homedir(), file) : `.${path.sep}${file}`;

const pathInit = makePath('todo.ini', true);
const pathData = (await read(pathInit)) || makePath('todo.json');

const saveData = async (data, maskPath) => {
  const pathDataNew = ['here', 'home'].includes(maskPath)
    ? makePath('todo.json', maskPath === 'home')
    : pathData;
  const isRename = pathData !== pathDataNew;

  if (
    !(await write(pathDataNew, data)) ||
    !(await write(pathInit, pathDataNew))
  ) {
    console.log(
      `Ошибка ${isRename ? 'переноса' : 'записи'} архива задач в '${pathDataNew}'`,
    );
    return;
  }
  if (isRename) {
    await remove(pathData);
  }
  console.log(`Архив задач ${isRename ? 'перемещен ' : ''}в '${pathDataNew}'`);
};

export const execution = async args => {
  const data = (await read(pathData)) || [];

  if (args.command === 'save') {
    await saveData(data, args.maskPath);
    return;
  }

  if (data.length === 0 && args.command !== 'add') {
    console.log(`Задачи отсутствуют:\ntodo add <новая задача>`);
    return;
  }

  let index;
  if (args.params.includes('id')) {
    index = data.findIndex(rec => rec.id === args.id);
    if (index < 0) {
      console.log(`Не найдена задача с идентификатором ${args.id}`);
      return;
    }
  }

  switch (args.command) {
    case 'add':
      const id = data.length ? data[data.length - 1].id + 1 : 1;
      if (id < 1000000) {
        data.push({ id, status: 'новая', task: args.task });
        console.log(`Задача добавлена с идентификатором ${id}`);
        break;
      } else {
        console.log('Лимит задач исчерпан.');
        return;
      }

    case 'list':
      console.log('Список задач:');
      data.forEach(rec => {
        console.log(`${rec.id}. [${rec.status}] ${rec.task}`);
      });
      return;

    case 'get':
      console.log(`Задача с идентификатором ${data[index].id}:
Название: ${data[index].task}
Статус: ${data[index].status}
  `);
      return;

    case 'update':
      data[index].task = args.newTask;
      console.log(`Задача с идентификатором ${args.id} обновлена`);
      break;

    case 'status':
      data[index].status = args.status;
      console.log(`Статус задачи с идентификатором ${args.id} обновлен`);
      break;

    case 'delete':
      data.splice(index, 1);
      console.log(`Задача с идентификатором ${args.id} удалена`);
      break;
  }
  if (!(await write(pathData, data))) {
    console.log('Ошибка записи. Изменения не сохранены');
  }
};
