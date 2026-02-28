import { readFile, writeFile } from 'node:fs/promises';

export const read = async pathFile => {
  try {
    const result = await readFile(pathFile, 'utf-8');
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

export const write = async (pathFile, data) => {
  try {
    await writeFile(pathFile, data, 'utf-8');
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
