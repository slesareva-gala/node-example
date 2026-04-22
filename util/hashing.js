import crypto from 'node:crypto';
import { readData, writeData } from '../helpers/fileSystem.js';

export const writeHash = async (filepath, fileHash) => {
  const data = await readData(filepath);
  if (data === null) return false;

  const hash = crypto.createHash('sha256').update(data).digest('hex');

  return await writeData(fileHash, hash);
};

export const compareHash = async (filepath, fileHash) => {
  const data = await readData(filepath);
  if (data === null) return;

  const hash1 = await readData(fileHash);
  if (hash1 === null) return;

  const hash2 = crypto.createHash('sha256').update(data).digest('hex');

  console.log(
    `Хэш '${hash1}' из файла:\n${fileHash}\nи хэш '${hash2}' файла:\n${filepath}\n${hash1 === hash2 ? 'совпали' : 'различны'}.`,
    `Целостность архивных данных ${hash1 === hash2 ? 'сохранена' : 'нарушена'}.\n`,
  );
};
