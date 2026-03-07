import { readFile, writeFile, rm } from 'node:fs/promises';

export const read = async pathFile => {
  try {
    const data = await readFile(pathFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

export const write = async (pathFile, data) => {
  try {
    await writeFile(pathFile, JSON.stringify(data), 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
};

export const remove = async pathFile => {
  try {
    await rm(pathFile);
    return true;
  } catch (e) {
    return false;
  }
};
