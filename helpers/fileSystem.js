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

export const partsFileName = filepath => {
  const dir = path.dirname(filepath);
  const ext = path.extname(filepath);
  const name = path.basename(filepath, ext);
  const sep = path.sep;
  return { dir, name, ext, sep };
};

export const readData = async pathFile => {
  try {
    const data = await readFile(pathFile);
    return data.toString();
  } catch (e) {
    console.error('readData: ', e.message);
    return null;
  }
};

export const writeData = async (pathFile, data) => {
  try {
    await writeFile(pathFile, data);
    return true;
  } catch (e) {
    console.error('writeData: ', e.message);
    return false;
  }
};
