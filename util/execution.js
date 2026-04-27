import {
  addTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} from './queriesDatabase.js';

export const execution = async args => {
  switch (args.command) {
    case 'add':
      const id = await addTask({ task: args.task, status: 'новая' });

      if (id === null) console.error('Ошибка: задача не добавлена');
      else console.log(`Задача добавлена с идентификатором ${id}`);
      return;

    case 'list':
      const tasks = await listTasks();
      if (tasks === null) {
        console.error('Ошибка при получении списка задач');
        return;
      }
      if (tasks.length === 0) {
        console.log(`Задачи отсутствуют:\ntodo add <новая задача>`);
        return;
      }
      console.log('Список задач:');
      tasks.forEach(rec => {
        console.log(`${rec.id}. [${rec.status}] ${rec.task}`);
      });
      return;

    case 'get':
      const task = await getTask(args.id);
      if (!task) {
        console.error(
          `${task === undefined ? 'Не найдена задача' : 'Ошибка при получении задачи'} с идентификатором ${args.id}`,
        );
        return;
      }

      console.log(`Задача с идентификатором ${task.id}:
Название: ${task.task}
Статус: ${task.status}
  `);
      return;

    case 'update':
      const updatedTask = await updateTask(args.id, 'task', args.newTask);
      if (!updatedTask) {
        console.error(
          `${updatedTask === 0 ? 'Не найдена задача' : 'Ошибка при обновлении задачи'} с идентификатором ${args.id}`,
        );
        return;
      }

      console.log(`Задача с идентификатором ${args.id} обновлена`);
      return;

    case 'status':
      const updatedStatus = await updateTask(args.id, 'status', args.status);
      if (!updatedStatus) {
        console.error(
          `${updatedStatus === 0 ? 'Не найдена задача' : 'Ошибка при обновлении статуса задачи'} с идентификатором ${args.id}`,
        );
        return;
      }

      console.log(`Статус задачи с идентификатором ${args.id} обновлен`);
      return;

    case 'delete':
      const deleted = await deleteTask(args.id);
      if (!deleted) {
        console.error(
          `${deleted === 0 ? 'Не найдена задача' : 'Ошибка при удалении задачи'} с идентификатором ${args.id}`,
        );
        return;
      }

      console.log(`Задача с идентификатором ${args.id} удалена`);
      return;
  }
};
