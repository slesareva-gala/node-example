import { access, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const checkFile = async filepath => {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
};

export const readJSON = async pathFile => {
  try {
    const data = await readFile(pathFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    console.error('readJSON: ', e.message);
    return null;
  }
};

export const writeJSON = async (pathFile, data) => {
  try {
    await writeFile(pathFile, JSON.stringify(data), 'utf-8');
    return true;
  } catch (e) {
    console.error('writeJSON: ', e.message);
    return false;
  }
};
