import { readFile, writeFile, rm } from 'node:fs/promises';

export const read = async (pathFile, errValue = []) => {
  try {
    const data = await readFile(pathFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return errValue;
  }
};

export const write = async (pathFile, data, errValue = false) => {
  try {
    await writeFile(pathFile, JSON.stringify(data), 'utf-8');
    return true;
  } catch (e) {
    return errValue;
  }
};

export const remove = async (pathFile, errValue = false) => {
  try {
    await rm(pathFile);
    return true;
  } catch (e) {
    return errValue;
  }
};
