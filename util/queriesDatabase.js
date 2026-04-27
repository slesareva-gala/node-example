import 'dotenv/config';
import { default as Knex } from 'knex';

const knex = new Knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
  },
});

const table = 'tasks';

//"tasks_id_seq"
export const addTask = async ({ task, status }) => {
  const result = await knex(table)
    .insert({ task, status })
    .returning('id')
    .catch(e => {
      console.error('Ошибка при добавлении задачи:', e);
      return null;
    })
    .finally(() => knex.destroy());

  return result === null ? null : result[0].id;
};

export const listTasks = async () => {
  const result = await knex(table)
    .orderBy('id')
    .catch(e => null)
    .finally(() => knex.destroy());
  return result;
};

export const getTask = async id => {
  const result = await knex(table)
    .where({ id })
    .first()
    .catch(e => null)
    .finally(() => knex.destroy());
  return result;
};

export const updateTask = async (id, field, value) => {
  const result = await knex(table)
    .where({ id })
    .update({ [field]: value })
    .catch(e => null)
    .finally(() => knex.destroy());
  return result;
};

export const deleteTask = async id => {
  const result = await knex(table)
    .where({ id })
    .del()
    .catch(e => null)
    .finally(() => knex.destroy());
  return result;
};
