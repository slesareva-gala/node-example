import { read, write } from './files.system.js';
const pathData = './todo.json';

const readData = async () => {
  try {
    const data = await read(pathData);
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const writeData = async data => {
  try {
    await write(pathData, JSON.stringify(data));
  } catch (e) {
    console.log('Ошибка записи. Изменения не сохранены', e);
  }
};

export const execution = async args => {
  const data = await readData();

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
  writeData(data);
};
